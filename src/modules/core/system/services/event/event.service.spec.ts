import {
    fakeAsync,
    TestBed,
    tick,
} from '@angular/core/testing';
import {Subject} from 'rxjs';

import {EventService} from './event.service';
import {
    IEvent,
    HooksService,
} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';

describe('EventService', () => {
    let eventService: EventService;
    const testEventOne: IEvent<any> = {
        name: 'TEST_EVENT_ONE',
        from: 'TEST_ONE',
        status: 'success',
        data: {
            value: 1,
        },
    };
    const testEventTwo: IEvent<any> = {
        name: 'TEST_EVENT_TWO',
        from: 'TEST_TWO',
        status: 'success',
        data: {
            value: 2,
        },
    };
    const testEventThree: IEvent<any> = {
        name: 'TEST_EVENT_THREE',
        from: 'TEST_THREE',
        status: 'error',
        data: {
            value: 3,
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EventService,
                HooksService,
            ],
        });

        eventService = TestBed.inject(EventService);
    });

    afterEach(() => {
        eventService = null;
    });

    it('-> should be created', () => {
        expect(eventService).toBeTruthy();
    });

    it('-> should send single event', (done) => {
        eventService.flow.subscribe({
            next: (event) => {
                expect(event).toEqual(_assign({type: 'event'}, testEventOne));
                done();
            },
        });
        eventService.emit(testEventOne);
    });

    it('-> should send multiple events', fakeAsync(() => {
        let eventNumber = 0;
        eventService.flow.subscribe({
            next: (event: IEvent<any>) => {
                eventNumber += event.data.value;
            },
        });
        eventService.emit(testEventOne);
        eventService.emit(testEventTwo);
        eventService.emit(testEventThree);
        tick(1000);
        expect(eventNumber).toEqual(6);
    }));


    it('-> should filter single event', (done) => {
        eventService.filter({name: testEventOne.name}).subscribe({
            next: (event) => {
                expect(event).not.toEqual(testEventTwo);
                expect(event).toEqual(_assign({type: 'event'}, testEventOne));
                done();
            },
        });

        eventService.emit(testEventTwo);
        eventService.emit(testEventOne);
    });

    it('-> should filter multiple events', (done) => {
        let eventNumber = 0;
        eventService.filter([
            {
                name: testEventOne.name,
            },
            {
                from: testEventTwo.from,
            },
        ]).subscribe({
            next: (event) => {
                eventNumber++;

                if (eventNumber === 1) {
                    expect(event).toEqual(_assign({type: 'event'}, testEventTwo));
                }

                if (eventNumber === 2) {
                    expect(event).toEqual(_assign({type: 'event'}, testEventOne));
                    done();
                }
            },
        });
        eventService.emit(testEventTwo);
        eventService.emit(testEventOne);
    });

    it('-> should filter multiple events with identical field', (done) => {
        let eventNumber = 0;
        eventService.filter([
            {
                status: 'success',
            },
        ]).subscribe({
            next: (event) => {
                expect(event).not.toEqual(_assign({type: 'event'}, testEventThree));
                eventNumber++;

                if (eventNumber === 1) {
                    expect(event).toEqual(_assign({type: 'event'}, testEventOne));
                }

                if (eventNumber === 2) {
                    expect(event).toEqual(_assign({type: 'event'}, testEventTwo));
                    done();
                }
            },
        });
        eventService.emit(testEventThree);
        eventService.emit(testEventOne);
        eventService.emit(testEventTwo);
    });

    it('-> should subscribe single event', (done) => {
        eventService.subscribe(
            {
                name: testEventThree.name,
            },
            (eventData) => {
                expect(eventData).toEqual(testEventThree.data);
                done();
            },
        );
        eventService.emit(testEventThree);
        eventService.emit(testEventOne);
        eventService.emit(testEventTwo);
    });

    it('-> should subscribe multiple events', (done) => {
        let eventNumber = 0;
        eventService.subscribe(
            [
                {
                    from: testEventOne.from,
                },
                {
                    from: testEventTwo.from,
                },
            ],
            (eventData) => {
                eventNumber++;
                if (eventNumber === 1) {
                    expect(eventData).toEqual(testEventOne.data);
                }

                if (eventNumber === 2) {
                    expect(eventData).toEqual(testEventTwo.data);
                    done();
                }
            },
        );
        eventService.emit(testEventThree);
        eventService.emit(testEventOne);
        eventService.emit(testEventTwo);
    });

    it('-> should subscribe multiple events with identical field', (done) => {
        let eventNumber = 0;
        eventService.subscribe(
            {
                status: testEventOne.status,
            },
            (eventData) => {
                eventNumber++;
                if (eventNumber === 1) {
                    expect(eventData).toEqual(testEventTwo.data);
                }

                if (eventNumber === 2) {
                    expect(eventData).toEqual(testEventOne.data);
                    done();
                }
            },
        );
        eventService.emit(testEventTwo);
        eventService.emit(testEventThree);
        eventService.emit(testEventOne);
    });

    // it('-> should filter do unsubscribe when destroy subject emit', fakeAsync(
    //     () => {
    //         let eventNumberDestroy = 0;
    //         let eventNumber = 0;
    //         let $destroy = new Subject();
    //
    //         eventService.filter({name: testEventOne.name}, $destroy).subscribe({
    //             next: (event) => {
    //                 eventNumberDestroy++;
    //                 expect(event).toEqual(_assign({type: 'event'}, testEventOne));
    //             },
    //         });
    //
    //         eventService.filter({name: testEventOne.name}).subscribe({
    //             next: (event) => {
    //                 eventNumber++;
    //                 expect(event).toEqual(_assign({type: 'event'}, testEventOne));
    //             },
    //         });
    //
    //         eventService.emit(testEventOne);
    //         eventService.emit(testEventOne);
    //         eventService.emit(testEventOne);
    //         $destroy.next(null);
    //         $destroy.complete();
    //         eventService.emit(testEventOne);
    //         eventService.emit(testEventOne);
    //
    //         tick(1000);
    //
    //         expect(eventNumber).toEqual(5);
    //         expect(eventNumberDestroy).toEqual(3);
    //     }),
    // );

    it('-> should subscribe do unsubscribe when destroy subject emit', fakeAsync(
        () => {
            let eventNumberDestroy = 0;
            let eventNumber = 0;
            let $destroy = new Subject();


            eventService.subscribe({name: testEventTwo.name}, (eventData) => {
                eventNumberDestroy++;
                expect(eventData).toEqual(testEventTwo.data);
            }, $destroy);

            eventService.subscribe({name: testEventTwo.name}, (eventData) => {
                eventNumber++;
                expect(eventData).toEqual(testEventTwo.data);
            });

            eventService.emit(testEventTwo);
            eventService.emit(testEventTwo);
            eventService.emit(testEventTwo);
            eventService.emit(testEventTwo);

            tick(1000);

            $destroy.next(null);
            $destroy.complete();

            tick(1000);

            eventService.emit(testEventTwo);
            eventService.emit(testEventTwo);

            tick(1000);

            expect(eventNumber).toEqual(6);
            expect(eventNumberDestroy).toEqual(4);
        }),
    );
});

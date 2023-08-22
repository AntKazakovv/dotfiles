import {TestBed} from '@angular/core/testing';
import {WebsocketService} from './websocket.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {DataService} from 'wlc-engine/modules/core/system/services';
import {Observable} from 'rxjs';

describe('WebsocketService', () => {
    let service: WebsocketService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;

    beforeEach(() => {
        dataServiceSpy = jasmine.createSpyObj(
            'DataService',
            ['request', 'registerMethod'],
        );

        eventServiceSpy = jasmine.createSpyObj('EventService', ['filter', 'subscribe']);
        eventServiceSpy.filter.and.returnValue(new Observable(() => {}));

        TestBed.configureTestingModule({
            providers: [
                WebsocketService,
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
            ],
        });
        service = TestBed.inject(WebsocketService);

    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

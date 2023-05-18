import {TestBed} from '@angular/core/testing';

import {BehaviorSubject} from 'rxjs';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {PragmaticPlayLiveService} from './pragmatic-play-live.service';

describe('PragmaticPlayLiveService', () => {
    let service: PragmaticPlayLiveService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;

    beforeEach(() => {
        eventServiceSpy = jasmine.createSpyObj('EventService', ['subscribe']);
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get'],
            {
                'ready': Promise.resolve(),
            },
        );
        configServiceSpy.get.and.returnValue(new BehaviorSubject(''));

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                PragmaticPlayLiveService,
            ],
        });
        service = TestBed.inject(PragmaticPlayLiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

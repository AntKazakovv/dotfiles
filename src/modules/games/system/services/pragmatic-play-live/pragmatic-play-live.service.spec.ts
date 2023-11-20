import {TestBed} from '@angular/core/testing';

import {BehaviorSubject} from 'rxjs';

import {
    ConfigService,
    EventService,
    WebsocketService,
} from 'wlc-engine/modules/core';
import {PragmaticPlayLiveService} from './pragmatic-play-live.service';

describe('PragmaticPlayLiveService', () => {
    let service: PragmaticPlayLiveService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let webSocketServiceSpy: jasmine.SpyObj<WebsocketService>;

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
        webSocketServiceSpy = jasmine.createSpyObj('WebsocketService', ['addWsEndPointConfig', 'getMessages']);

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
                {
                    provide: WebsocketService,
                    useValue: webSocketServiceSpy,
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

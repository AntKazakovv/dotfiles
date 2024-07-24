import {TestBed} from '@angular/core/testing';

import {BehaviorSubject} from 'rxjs';

import {
    ConfigService,
    EventService,
    WebsocketService,
} from 'wlc-engine/modules/core';
import {PragmaticPlayLiveService} from './pragmatic-play-live.service';
import {UserService} from 'wlc-engine/modules/user';

describe('PragmaticPlayLiveService', () => {
    let service: PragmaticPlayLiveService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let webSocketServiceSpy: jasmine.SpyObj<WebsocketService>;
    let userServiceSpy: jasmine.SpyObj<UserService>;

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
        userServiceSpy = jasmine.createSpyObj(
            'UserService',
            null,
            {
                userProfile$: new BehaviorSubject(null),
                profileReady: Promise.resolve(),
            },
        );

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
                {
                    provide: UserService,
                    useValue: userServiceSpy,
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

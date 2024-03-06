import {TestBed} from '@angular/core/testing';
import {UIRouter} from '@uirouter/core';

import {
    ActionService,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {PwaNotificationController} from './pwa-notification.controller';

describe('PwaNotificationController', () => {
    let controller: PwaNotificationController;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let actionServiceSpy: jasmine.SpyObj<ActionService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let routerSpy: jasmine.SpyObj<UIRouter>;

    beforeEach(() => {
        configServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
            ready: Promise.resolve(),
        });

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: ActionService,
                    useValue: actionServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: UIRouter,
                    useValue: routerSpy,
                },
                PwaNotificationController,
            ],
        });
        controller = TestBed.inject(PwaNotificationController);
    });

    it('should be created', () => {
        expect(controller).toBeTruthy();
    });
});

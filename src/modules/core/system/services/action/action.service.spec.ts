import {TestBed} from '@angular/core/testing';
import {
    StateService,
    TransitionService,
    UIRouter,
} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {DeviceModel} from 'wlc-engine/modules/core/system/models/device.model';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    DataService,
    IData,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ActionService} from './action.service';

declare const viewport;

describe('ActionService', () => {
    let actionService: ActionService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let layoutServiceSpy: jasmine.SpyObj<LayoutService>;
    let stateServiceSpy: jasmine.SpyObj<StateService>;
    let cachingServiceSpy: jasmine.SpyObj<CachingService>;
    let transitionServiceSpy: jasmine.SpyObj<TransitionService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;
    let routerSpy: jasmine.SpyObj<UIRouter>;
    let window: Window;

    configServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
        ready: Promise.resolve(),
    });
    eventServiceSpy = jasmine.createSpyObj('EventService',['emit']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    layoutServiceSpy = jasmine.createSpyObj('LayoutService', ['generateFullConfigWithLayouts']);
    stateServiceSpy = jasmine.createSpyObj('StateService', ['go']);
    cachingServiceSpy = jasmine.createSpyObj('CachingService', ['set', 'get', 'clear']);
    transitionServiceSpy = jasmine.createSpyObj('TransitionService', ['onBefore']);
    logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
    dataServiceSpy = jasmine.createSpyObj('DataService', [], {
        get flow(): Observable<IData> {
            return new BehaviorSubject<IData>({
                status: 'success',
                system: 'user',
                name: 'userInfo',
                code: 200,
                data: {
                    loyalty: {
                        DepositsCount: 1,
                    },
                },
            }).asObservable();
        },
    });
    modalServiceSpy = jasmine.createSpyObj('ModalService', [
        'showModal',
        'getActiveModal',
        'closeAllModals',
        'hideModal',
    ]);
    routerSpy = jasmine.createSpyObj('UIRouter', [], {
        globals: {
            transition: {
                to: () => {},
            },
        },
    });

    beforeEach(() => {
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
                    provide: TranslateService,
                    useValue: translateServiceSpy,
                },
                {
                    provide: LayoutService,
                    useValue: layoutServiceSpy,
                },
                {
                    provide: StateService,
                    useValue: stateServiceSpy,
                },
                {
                    provide: CachingService,
                    useValue: cachingServiceSpy,
                },
                {
                    provide: TransitionService,
                    useValue: transitionServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
                {
                    provide: ModalService,
                    useValue: modalServiceSpy,
                },
                {
                    provide: UIRouter,
                    useValue: routerSpy,
                },
                ActionService,
                WINDOW_PROVIDER,
            ],
        });

        window = TestBed.inject<Window>(WINDOW);
        actionService = TestBed.inject(ActionService);
    });

    it('-> should be created', () => {
        expect(actionService).toBeTruthy();
    });

    it('-> lockBody/unlockBody: checking adding and removing styles', () => {
        const body = document.querySelector('body');

        actionService.lockBody();
        expect(body.style.height).toEqual('100%');
        expect(body.style.overflow).toEqual('hidden');

        actionService.unlockBody();
        expect(body.style.height).toEqual('');
        expect(body.style.overflow).toEqual('');
    });

    it('-> deviceOrientation: check deviceOrientation method', () => {

        actionService.device = new DeviceModel({
            breakpoints: {
                desktop: 1024,
                tablet: 768,
                mobile: 0,
            },
        }, window);

        viewport.set('mobile');
        expect(actionService.deviceOrientation()).toEqual('portrait');

        viewport.set('tablet');
        expect(actionService.deviceOrientation()).toEqual('portrait');

        viewport.set('screen');
        expect(actionService.deviceOrientation()).toEqual('landscape');

        viewport.reset();
    });
});

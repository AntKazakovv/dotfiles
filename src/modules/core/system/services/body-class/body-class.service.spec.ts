import {TestBed} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import _each from 'lodash-es/each';

import {
    BodyClassPrefix,
    BodyClassService,
    TBodyClassPrefix,
} from './body-class.service';
import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';

describe('BodyClassService', () => {
    let bodyClassService: BodyClassService;
    let document: Document;
    let body: HTMLBodyElement;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let ActionServiceSpy: jasmine.SpyObj<ActionService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;

    beforeEach(() => {

        ActionServiceSpy = jasmine.createSpyObj(
            'ActionService',
            ['getDeviceType', 'deviceType'],
            {
                device: {
                    osName: 'ios',
                    browserName: 'safari',
                },
            },
        );
        ActionServiceSpy.getDeviceType.and.returnValue(DeviceType.Mobile);
        ActionServiceSpy.deviceType.and.returnValue(new Observable<DeviceType>(() => {}));

        ConfigServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['load', 'get', 'set'],
            {
                'ready': Promise.resolve(),
            },
        );
        ConfigServiceSpy.get.and.returnValues({});
        ConfigServiceSpy.get.withArgs('appConfig.country').and.returnValues('rus');
        ConfigServiceSpy.get.withArgs('appConfig.language').and.returnValues('en');
        ConfigServiceSpy.get.withArgs('device').and.returnValues('mobile');
        ConfigServiceSpy.get.withArgs('$base.affiliate.siteUrl').and.returnValues('');
        ConfigServiceSpy.get.withArgs('$base.colorThemeSwitching.use').and.returnValues(false);
        ConfigServiceSpy.get.withArgs('$user.isAuthenticated').and.returnValues(false);
        ConfigServiceSpy.get.withArgs('$user.isAuth$').and.returnValues(new BehaviorSubject(false));

        logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
        translateServiceSpy = jasmine.createSpyObj('TranslateService', [], {
            onLangChange: new EventEmitter,
        });
        eventServiceSpy = jasmine.createSpyObj(
            'EventService',
            ['emit', 'subscribe'],
        );

        TestBed.configureTestingModule({
            providers: [
                BodyClassService,
                WINDOW_PROVIDER,
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
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
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: ActionService,
                    useValue: ActionServiceSpy,
                },
            ],
        });

        bodyClassService = TestBed.inject(BodyClassService);
        document = TestBed.inject(DOCUMENT);
        body = document.querySelector('body');

        return ConfigServiceSpy.ready;
    });

    it('-> should be created', () => {
        expect(bodyClassService).toBeTruthy();
        expect(body.classList.contains('wlc-body--country-rus')).toBeTrue();
        expect(body.classList.contains('wlc-body--auth-0')).toBeTrue();
        expect(body.classList.contains('wlc-body--os-ios')).toBeTrue();
        expect(body.classList.contains('wlc-body--browser-safari')).toBeTrue();
        expect(body.classList.contains('wlc-body--device-mobile')).toBeTrue();
    });

    it('-> addModifier: adding modifier', () => {
        bodyClassService.addModifier('wlc-body--test');
        expect(body.classList.contains('wlc-body--test')).toBeTrue();
    });

    it('-> replaceModifier: replace modifier', () => {

        const testData: IIndexing<string[]> = {
            'lang': ['en', 'ru', '', undefined],
            'auth': ['1', '2'],
            'theme': ['test-theme', '123456', undefined],
            'device': ['ios', 'macos', 'windows', undefined],
        };

        _each(testData, (data: string[], key: TBodyClassPrefix) => {
            _each(data, (value: string, index: number) => {
                bodyClassService.replaceModifier(key, value);
                if (index) expect(body.classList.contains(BodyClassPrefix[key] + testData[key][index - 1])).toBeFalse();
                expect(body.classList.contains(BodyClassPrefix[key] + value)).toBeTrue();
            });
        });
    });

    it('-> removeClassByPrefix: remove class', () => {
        bodyClassService.replaceModifier('auth', '1');
        expect(body.classList.contains(BodyClassPrefix.auth + '1')).toBeTrue();
        bodyClassService.removeClassByPrefix(BodyClassPrefix.auth);
        expect(body.classList.contains(BodyClassPrefix.auth)).toBeFalse();
    });

    afterEach(() => {
        body.removeAttribute('class');
    });
});

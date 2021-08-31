import {TestBed} from '@angular/core/testing';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';
import {ActionService, ConfigService, DeviceType, IIndexing} from 'wlc-engine/modules/core';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {BodyClassPrefix, BodyClassService, TBodyClassPrefix} from './body-class.service';

import _each from 'lodash-es/each';

describe('BodyClassService', () => {
    let bodyClassService: BodyClassService;
    let document: Document;
    let body: HTMLBodyElement;
    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let ActionServiceSpy: jasmine.SpyObj<ActionService>;

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
            ['load', 'get'],
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

        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [
                BodyClassService,
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
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

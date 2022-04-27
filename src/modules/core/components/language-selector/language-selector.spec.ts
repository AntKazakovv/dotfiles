import {EventEmitter} from '@angular/core';

import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';

import {AppModule} from 'wlc-engine/modules/app/app.module';
import {
    ConfigService,
    ModalService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {ILanguage} from 'wlc-engine/modules/core/system/interfaces';
import {
    ILanguageSelectorCParams,
    LanguageSelectorComponent,
} from './language-selector.component';

describe('LanguageSelectorComponent', () => {
    let fixture: ComponentFixture<LanguageSelectorComponent>;
    let component: LanguageSelectorComponent;
    let mouseEvent: MouseEvent;

    let ConfigServiceSpy: jasmine.SpyObj<ConfigService>;
    let ModalServiceSpy: jasmine.SpyObj<ModalService>;
    let LogServiceSpy: jasmine.SpyObj<LogService>;
    let TranslateServiceSpy: jasmine.SpyObj<TranslateService>;

    /**
     * That number had been used in the several cases.
     * - Checks is available langauges count enough to language toggling
     * - Starts filtering langauges on init by themeMod
     * - Defines default theme mod if toggling on scroll is allowed
     */
    const ENOUGH_LONG = 6;
    const CURRENT_LANG: ILanguage = {
        code: 'en',
        label: 'English',
    };
    const LANGUAGES_LIST: ILanguage[] = [
        {
            code: 'ru',
            label: 'Russian',
        },
        CURRENT_LANG,
        {
            code: 'ca',
            label: 'Canada',
        },
        {
            code: 'cn',
            label: 'China',
        },
        {
            code: 'jp',
            label: 'Japan',
        },
        {
            code: 'nl',
            label: 'Netherland',
        },
        {
            code: 'it',
            label: 'Italy',
        },
        {
            code: 'fr',
            label: 'France',
        },
    ];

    const injectParams: ILanguageSelectorCParams = {
        componentName: 'wlc-language-selector',
        moduleName: 'core',
        class: 'wlc-language-selector',
        themeMod: 'bottom-left',
        type: 'click',
        common: {
            flags: {
                path: '/gstatic/wlc/flags/1x1/',
                dim: 'svg',
                replace: {
                    en: 'gb',
                    zh: 'cn',
                    'zh-hans': 'cn',
                    'zh-hant': 'cn',
                    'sp': 'es',
                    'pt-br': 'pt',
                    'da': 'dk',
                    'sv': 'se',
                },
            },
        },
        wlcElement: 'block_language-selector',
    };

    beforeEach(async () => {
        ConfigServiceSpy = jasmine.createSpyObj('ConfigService', ['load', 'get', 'set'], {
            ready: Promise.resolve(),
        });
        ConfigServiceSpy.get.and.returnValue('');
        ConfigServiceSpy.get.withArgs('appConfig.languages').and.returnValue(LANGUAGES_LIST);

        ModalServiceSpy = jasmine.createSpyObj('ModalService', ['showModal', 'hideModal']);
        LogServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);

        TranslateServiceSpy = jasmine.createSpyObj('TranslateService', ['get', 'use', 'getLangs', 'getTranslation'], {
            currentLang: CURRENT_LANG.code,
            onTranslationChange: new EventEmitter(),
            onLangChange: new EventEmitter(),
            onDefaultLangChange: new EventEmitter(),
        });
        TranslateServiceSpy.get.and.returnValue(new Observable());
        TranslateServiceSpy.getLangs.and.returnValue(LANGUAGES_LIST.map((l) => l.code));
        TranslateServiceSpy.use.and.returnValue(new Observable());

        await TestBed.configureTestingModule({
            imports: [
                AppModule,
            ],
            declarations: [
                LanguageSelectorComponent,
            ],
            providers: [
                {
                    provide: ConfigService,
                    useValue: ConfigServiceSpy,
                },
                {
                    provide: ModalService,
                    useValue: ModalServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: LogServiceSpy,
                },
                {
                    provide: TranslateService,
                    useValue: TranslateServiceSpy,
                },
            ],
        }).overrideComponent(LanguageSelectorComponent, {
            set: {
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: injectParams,
                    },
                ],
            },
        }).compileComponents();
        fixture = TestBed.createComponent(LanguageSelectorComponent);
        component = fixture.componentInstance;
        mouseEvent = new MouseEvent('mouse-event-type');
        fixture.detectChanges();
    });

    it('-> Sending image loading error log', () => {
        const langCode = 'en';
        const calledWith = {
            code: '0.7.0',
            data: {langCode},
        };

        component.imageError(langCode);
        expect(LogServiceSpy.sendLog).toHaveBeenCalledWith(calledWith);
    });

    it('-> Getting flag url', () => {
        const flag = 'zh-hans';
        const alias = 'cn';
        const url = component.getFlagUrl(flag);

        expect(url).toContain(alias);
    });

    it('-> No toggling with only one language', () => {
        component.hasSingleLang = true;

        const wasOpened = component.isOpened;
        component.toggle();

        expect(wasOpened).toBe(component.isOpened);
    });

    it('-> Toggle if the list of available languages is too short', () => {
        component.hasSingleLang = false;
        component.availableLanguages = LANGUAGES_LIST.slice(0, ENOUGH_LONG - 2);

        const wasOpened = component.isOpened;
        component.toggle();

        expect(wasOpened).not.toBe(component.isOpened);
    });

    it('-> Otherwise showing modal to switch language', () => {
        component.hasSingleLang = false;
        component.availableLanguages = LANGUAGES_LIST.slice(0, ENOUGH_LONG + 1);
        component.$params.themeMod = 'bottom-left';

        component.toggle();

        expect(ModalServiceSpy.showModal).toHaveBeenCalled();
    });

    it('-> Do nothing if passed language the same with the current', () => {
        component.changeLanguage(CURRENT_LANG.code, mouseEvent);
        expect(TranslateServiceSpy.use).not.toHaveBeenCalled();
    });

    it('-> Use translation service if passed language is different', () => {
        const lang = 'ru';
        component.changeLanguage(lang, mouseEvent);

        expect(TranslateServiceSpy.use).toHaveBeenCalledWith(lang);
    });

    it('-> Available languages fetching on initializing', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(TranslateServiceSpy.getLangs).toHaveBeenCalled();
    });

    it('-> The Current language should be skipped if "long" theme is enabled', () => {
        const languages = ['ru', 'en'];
        TranslateServiceSpy.getLangs.and.returnValue(languages);
        component['inlineParams'] = {
            themeMod: 'long',
        };
        component.ngOnInit();

        expect(component.availableLanguages.length).toEqual(languages.length - 1);
        expect(component.availableLanguages.includes(CURRENT_LANG)).toBeFalse();
        expect(component.hasSingleLang).toBeFalse();
    });

    it('-> Setting the current language after the fetching', () => {
        component.ngOnInit();
        expect(component.currentLanguage).toEqual(CURRENT_LANG);
    });

    it('-> Setting single language flag', () => {
        TranslateServiceSpy.getLangs.and.returnValue([CURRENT_LANG.code]);
        component.ngOnInit();

        expect(component.hasSingleLang).toBe(true);
    });
});

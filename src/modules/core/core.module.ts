// -- MODULES IMPORTS START --;
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {HammerModule} from '@angular/platform-browser';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularResizeEventModule} from 'angular-resize-event';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModalModule, MODAL_CONFIG_DEFAULT_OVERRIDE} from 'ngx-bootstrap/modal';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {SwiperModule} from 'swiper/angular';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {UIRouterModule} from '@uirouter/angular';
import {CompilerModule} from 'wlc-engine/modules/compiler/compiler.module';
import {MonitoringModule} from 'wlc-engine/modules/monitoring/monitoring.module';
// -- MODULES IMPORTS END --;

// -- SERVICES IMPORTS START --;
import {
    ActionService,
    AnimateButtonsService,
    CaptchaService,
    CachingService,
    ConfigService,
    ContactsService,
    DataService,
    EventService,
    FilesService,
    ForbiddenCountryService,
    LogService,
    ModalService,
    NotificationService,
    LayoutService,
    SeoService,
    StateHistoryService,
    BodyClassService,
    ColorThemeService,
    AppConfigModel,
} from './system/services';
import {RecaptchaService} from './system/services/recaptcha/recaptcha.service';
// -- SERVICES IMPORTS END  --;

// -- PROVIDERS IMPORTS START --;
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';
// -- PROVIDERS IMPORTS END -

// -- COMPONENTS IMPORTS  --;
import {AnimateSpriteComponent} from './components/animate-sprite/animate-sprite.component';
import {AccordionComponent} from 'wlc-engine/modules/core/components/accordion/accordion.component';
import {AmountLimitComponent} from './components/amount-limit/amount-limit.component';
import {BirthdayFieldComponent} from './components/birthday-field/birthday-field.component';
import {BurgerPanelComponent} from './components/burger-panel/burger-panel.component';
import {ButtonComponent} from './components/button/button.component';
import {CaptchaComponent} from './components/captcha/captcha.component';
import {CountryAndStateComponent} from './components/country-and-state/country-and-state.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {CopyrightComponent} from './components/copyright/copyright.component';
import {CounterComponent} from './components/counter/counter.component';
import {CurrencyComponent} from 'wlc-engine/modules/core/components/currency/currency.component';
import {DatepickerComponent} from './components/datepicker/datepicker.component';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {FeedbackFormComponent} from './components/feedback-form/feedback-form.component';
import {FloatPanelsComponent} from './components/float-panels/float-panels.component';
import {ForbiddenCountryComponent} from './components/forbidden-country/forbidden-country.component';
import {FormControlComponent} from './components/form-control/form-control.component';
import {FormWrapperComponent} from './components/form-wrapper/form-wrapper.component';
import {HistoryNameComponent} from './components/table/components/history-name/history-name.component';
import {IconComponent} from './components/icon/icon.component';
import {IconListComponent} from './components/icon-list/icon-list.component';
import {IconMerchantsListComponent} from './components/icon-merchants-list/icon-merchants-list.component';
import {IconPaymentsListComponent} from './components/icon-payments-list/icon-payments-list.component';
import {IconSafetyListComponent} from './components/icon-safety-list/icon-safety-list.component';
import {InfoPageComponent} from './components/info-page/info-page.component';
import {InputComponent} from './components/input/input.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {LayoutComponent} from './components/layout/layout.component';
import {LicenseComponent} from './components/license/license.component';
import {LinkBlockComponent} from './components/link-block/link-block.component';
import {LoaderComponent} from './components/loader/loader.component';
import {LoginSignupComponent} from './components/login-signup/login-signup.component';
import {LogoComponent} from './components/logo/logo.component';
import {MessageComponent} from 'wlc-engine/modules/core/components';
import {NotificationThreadComponent} from 'wlc-engine/modules/core/components';
import {RadioButtonsComponent} from './components/radio-buttons/radio-buttons.component';
import {RatingComponent} from './components/rating/rating.component';
import {RecaptchaPolicyComponent} from './components/recaptcha-policy/recaptcha-policy.component';
import {ScrollbarComponent} from './components/scrollbar/scrollbar.component';
import {ScrollUpComponent} from 'wlc-engine/modules/core/components/scroll-up/scroll-up.component';
import {SelectComponent} from './components/select/select.component';
import {SocialIconsComponent} from './components/social-icons/social-icons.component';
import {StepsComponent} from './components/steps/steps.component';
import {TabSwitcherComponent} from './components/tab-switcher/tab-switcher.component';
import {TableComponent} from './components/table/table.component';
import {TextBlockComponent} from './components/text-block/text-block.component';
import {TextareaComponent} from './components/textarea/textarea.component';
import {TimerComponent} from './components/timer/timer.component';
import {TitleComponent} from './components/title/title.component';
import {TooltipComponent} from './components/tooltip/tooltip.component';
import {WlcModalComponent} from './components/modal';
import {WlcNoContentComponent} from './components/no-content/no-content.component';
import {WlcPaginationComponent} from './components/pagination/pagination.component';
import {PlugComponent} from './components/plug/plug.component';
import {IconListItemComponent} from './components/icon-list-item/icon-list-item.component';
import {WrapperComponent} from 'wlc-engine/modules/core/components';
import {ThemeTogglerComponent} from './components/theme-toggler/theme-toggler.component';
import {AlertComponent} from './components/alert/alert.component';
// -- COMPONENTS IMPORTS END  --;

//  -- DIRECTIVES IMPORTS STARTS--;
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FallbackImgDirective} from './directives/fallback-img/fallback-img.directive';
import {InputMaskDirective} from './directives/input-mask.directive';
import {ClampDirective} from './directives/clamp.directive';
import {CopyToClipboardDirective} from './directives/copy-to-clipboard.directive';
import {DragNDropDirective} from 'wlc-engine/modules/core/directives/drag-n-drop/drag-n-drop.directive';
import {ValueLengthDirective} from './directives/value-length.directive';
import {ParallaxMovementDirective} from './directives/parallax-movement.directive';
import {AuthDirective} from './directives/auth.directive';
//  -- DIRECTIVES IMPORTS END  --;

// -- INTERCEPTOR IMPORTS STARTS --;
import {interceptors} from 'wlc-engine/modules/core/system/interceptors/interceptors';
// -- INTERCEPTOR IMPORTS END

//  -- PIPES IMPORTS STARTS--;
import {HlSubstrPipe} from './pipes/hlsubstr.pipe';
import {SafeHtmlPipe} from './pipes/safeHTML.pipe';
import {TruncatePipe} from './pipes/truncate.pipe';
//  -- PIPES IMPORTS END  --;

//  -- CONFIGS IMPORTS STARTS--;
import {GlobalHelper} from 'wlc-engine/modules/core/index';
import {coreConfig} from './system/config/core.config';
import {ICoreConfig} from './system/interfaces/core.interface';
//  -- CONFIGS IMPORTS STARTS--;
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<ICoreConfig>(coreConfig, _get($config, '$core', {}));

export const components = {
    'wlc-alert': AlertComponent,
    'wlc-animate-sprite': AnimateSpriteComponent,
    'wlc-accordion': AccordionComponent,
    'wlc-amount-limit': AmountLimitComponent,
    'wlc-birth-field': BirthdayFieldComponent,
    'wlc-button': ButtonComponent,
    'wlc-burger-panel': BurgerPanelComponent,
    'wlc-captcha': CaptchaComponent,
    'wlc-country-and-state': CountryAndStateComponent,
    'wlc-checkbox': CheckboxComponent,
    'wlc-copyright': CopyrightComponent,
    'wlc-counter': CounterComponent,
    'wlc-currency': CurrencyComponent,
    'wlc-datepicker': DatepickerComponent,
    'wlc-disclaimer': DisclaimerComponent,
    'wlc-error-page': ErrorPageComponent,
    'wlc-feedback-form': FeedbackFormComponent,
    'wlc-forbidden-country': ForbiddenCountryComponent,
    'wlc-form-control': FormControlComponent,
    'wlc-form-wrapper': FormWrapperComponent,
    'wlc-history-name': HistoryNameComponent,
    'wlc-icon': IconComponent,
    'wlc-icon-list': IconListComponent,
    'wlc-icon-payments-list': IconPaymentsListComponent,
    'wlc-icon-merchants-list': IconMerchantsListComponent,
    'wlc-icon-safety-list': IconSafetyListComponent,
    'wlc-info-page': InfoPageComponent,
    'wlc-input': InputComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-license': LicenseComponent,
    'wlc-link-block': LinkBlockComponent,
    'wlc-loader': LoaderComponent,
    'wlc-login-signup': LoginSignupComponent,
    'wlc-logo': LogoComponent,
    'wlc-modal': WlcModalComponent,
    'wlc-no-content': WlcNoContentComponent,
    'wlc-pagination': WlcPaginationComponent,
    'wlc-plug': PlugComponent,
    'wlc-radio-buttons': RadioButtonsComponent,
    'wlc-scroll-up': ScrollUpComponent,
    'wlc-rating': RatingComponent,
    'wlc-recaptcha-policy': RecaptchaPolicyComponent,
    'wlc-select': SelectComponent,
    'wlc-social-icons': SocialIconsComponent,
    'wlc-steps': StepsComponent,
    'wlc-tab-switcher': TabSwitcherComponent,
    'wlc-table': TableComponent,
    'wlc-theme-toggler': ThemeTogglerComponent,
    'wlc-text-block': TextBlockComponent,
    'wlc-textarea': TextareaComponent,
    'wlc-timer': TimerComponent,
    'wlc-title': TitleComponent,
    'wlc-tooltip': TooltipComponent,
    'wlc-wrapper': WrapperComponent,
};

export const services = {
    'animate-buttons-service': AnimateButtonsService,
};

@NgModule({
    imports: [
        CommonModule,
        UIRouterModule,
        BrowserAnimationsModule,
        HammerModule,
        TranslateModule,
        FormsModule,
        SwiperModule,
        ReactiveFormsModule,
        AngularResizeEventModule,
        ModalModule,
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        AngularMyDatePickerModule,
        CompilerModule,
        MonitoringModule,
    ],
    providers: [
        DataService,
        EventService,
        CaptchaService,
        ConfigService,
        FilesService,
        ForbiddenCountryService,
        LogService,
        ActionService,
        AnimateButtonsService,
        ModalService,
        ContactsService,
        LayoutService,
        SeoService,
        StateHistoryService,
        CachingService,
        NotificationService,
        GlobalHelper.bootstrapProviders(NotificationService),
        BodyClassService,
        RecaptchaService,
        ColorThemeService,
        ...interceptors,
        {
            provide: MODAL_CONFIG_DEFAULT_OVERRIDE,
            useValue: {
                animated: true,
            },
        },
        {
            provide: CuracaoRequirement,
            useFactory: (config: ConfigService) => {
                const {projectType, license} = config.get<AppConfigModel>('appConfig');
                return config.get<boolean>('$base.site.forceCuracaoRequirement')
                    || (projectType === 'wlc' && license === 'curacao');
            },
            deps: [ConfigService],
        },
    ],
    declarations: [
        AlertComponent,
        AnimateSpriteComponent,
        AccordionComponent,
        AmountLimitComponent,
        AuthDirective,
        BirthdayFieldComponent,
        BurgerPanelComponent,
        ButtonComponent,
        CaptchaComponent,
        CountryAndStateComponent,
        CheckboxComponent,
        ClampDirective,
        ClickOutsideDirective,
        CopyToClipboardDirective,
        CopyrightComponent,
        CounterComponent,
        CurrencyComponent,
        DatepickerComponent,
        DisclaimerComponent,
        DragNDropDirective,
        ErrorPageComponent,
        FallbackImgDirective,
        FeedbackFormComponent,
        FloatPanelsComponent,
        ForbiddenCountryComponent,
        FormControlComponent,
        FormWrapperComponent,
        HistoryNameComponent,
        IconComponent,
        IconListComponent,
        IconMerchantsListComponent,
        IconPaymentsListComponent,
        IconSafetyListComponent,
        IconListItemComponent,
        InfoPageComponent,
        InputComponent,
        InputMaskDirective,
        LanguageSelectorComponent,
        LayoutComponent,
        LicenseComponent,
        LinkBlockComponent,
        LoaderComponent,
        LoginSignupComponent,
        LogoComponent,
        MessageComponent,
        NgTemplateNameDirective,
        NotificationThreadComponent,
        ParallaxMovementDirective,
        PlugComponent,
        RadioButtonsComponent,
        RatingComponent,
        RecaptchaPolicyComponent,
        ScrollbarComponent,
        ScrollUpComponent,
        SelectComponent,
        SocialIconsComponent,
        StepsComponent,
        TabSwitcherComponent,
        TableComponent,
        ThemeTogglerComponent,
        TextBlockComponent,
        TextareaComponent,
        TimerComponent,
        TitleComponent,
        TooltipComponent,
        HlSubstrPipe,
        SafeHtmlPipe,
        TruncatePipe,
        ValueLengthDirective,
        WlcModalComponent,
        WlcNoContentComponent,
        WlcPaginationComponent,
        WrapperComponent,
    ],
    exports: [
        AlertComponent,
        AnimateSpriteComponent,
        AccordionComponent,
        AmountLimitComponent,
        AuthDirective,
        BirthdayFieldComponent,
        BrowserAnimationsModule,
        BurgerPanelComponent,
        ButtonComponent,
        CaptchaComponent,
        CountryAndStateComponent,
        CheckboxComponent,
        ClampDirective,
        ClickOutsideDirective,
        CopyToClipboardDirective,
        CopyrightComponent,
        CounterComponent,
        CurrencyComponent,
        DatepickerComponent,
        DisclaimerComponent,
        DragNDropDirective,
        ErrorPageComponent,
        FallbackImgDirective,
        FloatPanelsComponent,
        ForbiddenCountryComponent,
        FormControlComponent,
        FormWrapperComponent,
        HistoryNameComponent,
        IconComponent,
        IconListComponent,
        IconMerchantsListComponent,
        IconPaymentsListComponent,
        IconSafetyListComponent,
        IconListItemComponent,
        InfoPageComponent,
        InputComponent,
        InputMaskDirective,
        LanguageSelectorComponent,
        LayoutComponent,
        LicenseComponent,
        LinkBlockComponent,
        LoaderComponent,
        LoginSignupComponent,
        LogoComponent,
        NgTemplateNameDirective,
        ParallaxMovementDirective,
        PlugComponent,
        RadioButtonsComponent,
        RatingComponent,
        RecaptchaPolicyComponent,
        ScrollbarComponent,
        ScrollUpComponent,
        SelectComponent,
        SocialIconsComponent,
        StepsComponent,
        TabSwitcherComponent,
        TableComponent,
        ThemeTogglerComponent,
        TextBlockComponent,
        TextareaComponent,
        TimerComponent,
        TitleComponent,
        TooltipComponent,
        TooltipModule,
        TruncatePipe,
        HlSubstrPipe,
        SafeHtmlPipe,
        ValueLengthDirective,
        WlcModalComponent,
        WlcNoContentComponent,
        WlcPaginationComponent,
        WrapperComponent,
    ],
})
export class CoreModule {
}

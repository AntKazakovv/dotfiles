// -- MODULES IMPORTS START --;
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {
    HAMMER_GESTURE_CONFIG,
    HammerModule,
} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UIRouterModule} from '@uirouter/angular';
import {SwiperModule} from 'swiper/angular';
import {AngularResizedEventModule} from 'angular-resize-event';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
// -- MODULES IMPORTS END --;

// -- SERVICES IMPORTS START --;
import {
    ConfigService,
    DataService,
    EventService,
    FilesService,
    LogService,
    SentryService,
    ActionService,
    NotificationService,
    ModalService,
    ContactsService,
    CachingService,
} from './system/services';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// -- SERVICES IMPORTS END  --;

// -- COMPONENTS IMPORTS  --;
import {BurgerPanelComponent} from './components/burger-panel/burger-panel.component';
import {FloatPanelsComponent} from './components/float-panels/float-panels.component';
import {WrapperComponent} from './components/wrapper/wrapper.component';
import {FormWrapperComponent} from './components/form-wrapper/form-wrapper.component';
import {LogoComponent} from './components/logo/logo.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {IconComponent} from './components/icon/icon.component';
import {CounterComponent} from './components/counter/counter.component';
import {DynamicHtmlComponent} from './components/dynamic-html/dynamic-html.component';
import {WlcModalComponent} from './components/modal';
import {IconListComponent} from './components/icon-list/icon-list.component';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {ScrollbarComponent} from './components/scrollbar/scrollbar.component';
import {LicenseComponent} from './components/license/license.component';
import {FeedbackFormComponent} from './components/feedback-form/feedback-form.component';
import {InputComponent} from './components/input/input.component';
import {ButtonComponent} from './components/button/button.component';
import {LinkBlockComponent} from './components/link-block/link-block.component';
import {LoaderComponent} from './components/loader/loader.component';
import {LayoutComponent} from './components/layout/layout.component';
import {TextareaComponent} from './components/textarea/textarea.component';
import {SelectComponent} from './components/select/select.component';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {FormControlComponent} from './components/form-control/form-control.component';
import {InfoPageComponent} from './components/info-page/info-page.component';
import {TableComponent} from './components/table/table.component';
import {CopyrightComponent} from './components/copyright/copyright.component';
import {NotificationThreadComponent} from './components/notification-thread/notification-thread.component';
import {MessageComponent} from './components/message/message.component';
import {CurrencyComponent} from 'wlc-engine/modules/core/components/currency/currency.component';
import {DatepickerComponent} from './components/datepicker/datepicker.component';
import {TextBlockComponent} from './components/text-block/text-block.component';
import {RadioButtonsComponent} from './components/radio-buttons/radio-buttons.component';
import {TimerComponent} from './components/timer/timer.component';
import {TitleComponent} from './components/title/title.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';

// -- COMPONENTS IMPORTS END  --;

//  -- DIRECTIVES IMPORTS STARTS--;
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {FallbackImgDirective} from './directives/fallback-img.directive';
import {InputMaskDirective} from './directives/input-mask.directive';
import {ClampDirective} from './directives/clamp.directive';
import {CopyToClipboardDirective} from './directives/copy-to-clipboard.directive';
import {DrugNDropDirective} from 'wlc-engine/modules/core/directives/drug-n-drop/drug-n-drop.directive';
import {ValueLengthDirective} from './directives/value-length.directive';
import {ParallaxMovementDirective} from './directives/parallax-movement.directive';
import {AuthDirective} from './directives/auth.directive';
//  -- DIRECTIVES IMPORTS END  --;

//  -- PIPES IMPORTS STARTS--;
import {TruncatePipe} from './pipes/truncate.pipe';
//  -- PIPES IMPORTS END  --;

//  -- CONSTANTS IMPORTS STARTS--;
import {CRYPTOCURRENCIES, cryptocurrencies} from 'wlc-engine/modules/core/constants/currency-formats.constant';
//  -- CONSTANTS IMPORTS END  --;

//  -- CONFIGS IMPORTS STARTS--;
import {HammerConfig} from 'wlc-engine/modules/core/system/config/hammer.config';
import {GlobalHelper} from 'wlc-engine/modules/core/index';
import {coreConfig} from './system/config/core.config';
import {ICoreConfig} from './system/interfaces/core.interface';
//  -- CONFIGS IMPORTS STARTS--;
import * as $config from 'wlc-config/index';


import {
    get as _get,
} from 'lodash-es';

export const moduleConfig =
    GlobalHelper.mergeConfig<ICoreConfig>(coreConfig, _get($config, '$core', {}));

export const components = {
    'wlc-button': ButtonComponent,
    'wlc-checkbox': CheckboxComponent,
    'wlc-copyright': CopyrightComponent,
    'wlc-currency': CurrencyComponent,
    'wlc-datepicker': DatepickerComponent,
    'wlc-disclaimer': DisclaimerComponent,
    'wlc-dynamic-html': DynamicHtmlComponent,
    'wlc-counter': CounterComponent,
    'wlc-feedback-form': FeedbackFormComponent,
    'wlc-form-control': FormControlComponent,
    'wlc-form-wrapper': FormWrapperComponent,
    'wlc-icon': IconComponent,
    'wlc-icon-list': IconListComponent,
    'wlc-info-page': InfoPageComponent,
    'wlc-input': InputComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-license': LicenseComponent,
    'wlc-link-block': LinkBlockComponent,
    'wlc-loader': LoaderComponent,
    'wlc-logo': LogoComponent,
    'wlc-modal': WlcModalComponent,
    'wlc-radio-buttons': RadioButtonsComponent,
    'wlc-select': SelectComponent,
    'wlc-table': TableComponent,
    'wlc-text-block': TextBlockComponent,
    'wlc-textarea': TextareaComponent,
    'wlc-timer': TimerComponent,
    'wlc-title': TitleComponent,
    'wlc-wrapper': WrapperComponent,
    'wlc-error-page': ErrorPageComponent,
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
        AngularResizedEventModule,
        ModalModule,
        AngularMyDatePickerModule,
    ],
    providers: [
        DataService,
        EventService,
        ConfigService,
        FilesService,
        LogService,
        SentryService,
        ActionService,
        ModalService,
        ContactsService,
        {provide: CRYPTOCURRENCIES, useValue: cryptocurrencies},
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig,
        },
        CachingService,
        NotificationService,
        GlobalHelper.bootstrapProviders(NotificationService),
    ],
    declarations: [
        AuthDirective,
        BurgerPanelComponent,
        ButtonComponent,
        CheckboxComponent,
        ClickOutsideDirective,
        CopyrightComponent,
        CopyToClipboardDirective,
        CounterComponent,
        CurrencyComponent,
        DatepickerComponent,
        DisclaimerComponent,
        DynamicHtmlComponent,
        FallbackImgDirective,
        FeedbackFormComponent,
        FloatPanelsComponent,
        FormControlComponent,
        FormWrapperComponent,
        IconComponent,
        IconListComponent,
        InfoPageComponent,
        InputComponent,
        InputMaskDirective,
        RadioButtonsComponent,
        ClampDirective,
        LanguageSelectorComponent,
        LayoutComponent,
        LicenseComponent,
        LinkBlockComponent,
        LoaderComponent,
        LogoComponent,
        MessageComponent,
        WlcModalComponent,
        NgTemplateNameDirective,
        NotificationThreadComponent,
        ParallaxMovementDirective,
        ScrollbarComponent,
        SelectComponent,
        TableComponent,
        TextareaComponent,
        TextBlockComponent,
        TruncatePipe,
        TimerComponent,
        TitleComponent,
        ValueLengthDirective,
        WlcModalComponent,
        WrapperComponent,
        WrapperComponent,
        ErrorPageComponent,
        DrugNDropDirective,
    ],
    exports: [
        AuthDirective,
        BrowserAnimationsModule,
        BurgerPanelComponent,
        ButtonComponent,
        CheckboxComponent,
        ClickOutsideDirective,
        CopyrightComponent,
        CopyToClipboardDirective,
        CounterComponent,
        CurrencyComponent,
        DatepickerComponent,
        DisclaimerComponent,
        DynamicHtmlComponent,
        FallbackImgDirective,
        FloatPanelsComponent,
        FormControlComponent,
        FormWrapperComponent,
        IconComponent,
        IconListComponent,
        InfoPageComponent,
        InputComponent,
        InputMaskDirective,
        LanguageSelectorComponent,
        LayoutComponent,
        LicenseComponent,
        LinkBlockComponent,
        LoaderComponent,
        LogoComponent,
        WlcModalComponent,
        NgTemplateNameDirective,
        ScrollbarComponent,
        SelectComponent,
        TableComponent,
        TextareaComponent,
        CopyrightComponent,
        DatepickerComponent,
        InputMaskDirective,
        ParallaxMovementDirective,
        RadioButtonsComponent,
        ClampDirective,
        TextBlockComponent,
        TruncatePipe,
        ValueLengthDirective,
        WlcModalComponent,
        WrapperComponent,
        TimerComponent,
        TitleComponent,
        ErrorPageComponent,
        DrugNDropDirective,
    ],
})
export class CoreModule {
}

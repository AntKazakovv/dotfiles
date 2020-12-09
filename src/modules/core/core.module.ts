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
import {SwiperModule} from 'ngx-swiper-wrapper';
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
    ModalService,
    ContactsService,
} from './services';
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
import {DynamicHtmlComponent} from './components/dynamic-html/dynamic-html.component';
import {WlcModalComponent} from './components/modal';
import {IconListComponent} from './components/icon-list/icon-list.component';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {ScrollbarComponent} from './components/scrollbar/scrollbar.component';
import {LicenseComponent} from './components/license/license.component';
import {FeedbackFormComponent} from './components/feedback-form/feedback-form.component';
import {InputComponent} from './components/input/input.component';
import {ButtonComponent} from './components/button/button.component';
import {CloseComponent} from './components/close/close.component';
import {LoaderComponent} from './components/loader/loader.component';
import {LayoutComponent} from './components/layout/layout.component';
import {TextareaComponent} from './components/textarea/textarea.component';
import {SelectComponent} from './components/select/select.component';
import {CheckboxComponent} from './components/checkbox/checkbox/checkbox.component';
import {FormControlComponent} from './components/form-control/form-control.component';
import {InfoPageComponent} from './components/info-page/info-page.component';
import {TableComponent} from './components/table/table.component';
import {CopyrightComponent} from './components/copyright/copyright.component';
import {DatepickerComponent} from './components/datepicker/datepicker.component';
// -- COMPONENTS IMPORTS END  --;

//  -- DIRECTIVES IMPORTS STARTS--;
import {NgTemplateNameDirective} from './directives/template-name/template-name.directive';
import {PasswordVisibilityDirective} from './directives/password-visibility.directive';
import {ClickOutsideDirective} from './directives/click-outside.directive';
import {InputMaskDirective} from './directives/input-mask.directive';
//  -- DIRECTIVES IMPORTS END  --;

//  -- CONFIGS IMPORTS STARTS--;
import {HammerConfig} from 'wlc-engine/config/hammer.config';
import {DummyComponent} from './components/dummy/dummy.component';
//  -- CONFIGS IMPORTS STARTS--;

export const components = {
    'wlc-logo': LogoComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-icon': IconComponent,
    'wlc-dynamic-html': DynamicHtmlComponent,
    'wlc-button': ButtonComponent,
    'wlc-modal': WlcModalComponent,
    'wlc-icon-list': IconListComponent,
    'wlc-disclaimer': DisclaimerComponent,
    'wlc-loader': LoaderComponent,
    'wlc-license': LicenseComponent,
    'wlc-wrapper': WrapperComponent,
    'wlc-form-wrapper': FormWrapperComponent,
    'wlc-feedback-form': FeedbackFormComponent,
    'wlc-input': InputComponent,
    'wlc-textarea': TextareaComponent,
    'wlc-select': SelectComponent,
    'wlc-checkbox': CheckboxComponent,
    'wlc-info-page': InfoPageComponent,
    'wlc-form-control': FormControlComponent,
    'wlc-table': TableComponent,
    'wlc-dummy-amount': DummyComponent,
    'wlc-copyright': CopyrightComponent,
    'wlc-datepicker': DatepickerComponent,
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
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig,
        },
    ],
    declarations: [
        LayoutComponent,
        NgTemplateNameDirective,
        BurgerPanelComponent,
        FloatPanelsComponent,
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
        ButtonComponent,
        PasswordVisibilityDirective,
        WlcModalComponent,
        IconListComponent,
        DisclaimerComponent,
        ScrollbarComponent,
        LicenseComponent,
        InputComponent,
        SelectComponent,
        FeedbackFormComponent,
        CloseComponent,
        LoaderComponent,
        WrapperComponent,
        FormWrapperComponent,
        TextareaComponent,
        ClickOutsideDirective,
        CheckboxComponent,
        InfoPageComponent,
        FormControlComponent,
        TableComponent,
        DummyComponent,
        CopyrightComponent,
        DatepickerComponent,
        InputMaskDirective,
    ],
    exports: [
        LayoutComponent,
        WrapperComponent,
        FormWrapperComponent,
        NgTemplateNameDirective,
        BrowserAnimationsModule,
        BurgerPanelComponent,
        FloatPanelsComponent,
        TextareaComponent,
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
        ButtonComponent,
        PasswordVisibilityDirective,
        WlcModalComponent,
        IconListComponent,
        DisclaimerComponent,
        CloseComponent,
        LoaderComponent,
        ScrollbarComponent,
        LicenseComponent,
        InputComponent,
        SelectComponent,
        ClickOutsideDirective,
        CheckboxComponent,
        InfoPageComponent,
        FormControlComponent,
        TableComponent,
        DummyComponent,
        CopyrightComponent,
        DatepickerComponent,
        InputMaskDirective,
    ],
})
export class CoreModule {
}

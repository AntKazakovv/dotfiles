import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {AngularResizedEventModule} from 'angular-resize-event';

import {LogoComponent} from './components/logo/logo.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {IconComponent} from './components/icon/icon.component';
import {DynamicHtmlComponent} from './components/dynamic-html/dynamic-html.component';
import {ButtonComponent} from './components/button/button.component';
import {IconListComponent} from './components/icon-list/icon-list.component';
import {UIRouterModule} from '@uirouter/angular';
import {PasswordVisibilityDirective} from './directives/password-visibility.directive';
import {WlcModalComponent} from './components/modal/modal.component';
import {ModalService} from './services/modal/modal.service';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {
    MissingTranslationHandler,
    TranslateLoader,
    TranslateModule,
} from '@ngx-translate/core';
import {CloseComponent} from './components/close/close.component';
import {BonusComponent} from './components/bonus/bonus.component';
import {LoaderComponent} from './components/loader/loader.component';
import {ScrollbarComponent} from './components/scrollbar/scrollbar.component';
import {LicenseComponent} from './components/license/license.component';
import {ContactsService} from 'wlc-engine/modules/base/services/contacts/contacts.service';

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
};

@NgModule({
    declarations: [
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
        BonusComponent,
        LoaderComponent,
        ScrollbarComponent,
        LicenseComponent,
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        TranslateModule,
        SwiperModule,
        AngularResizedEventModule,
    ],
    exports: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
        ButtonComponent,
        WlcModalComponent,
        IconListComponent,
        PasswordVisibilityDirective,
        CloseComponent,
        BonusComponent,
        LoaderComponent,
        ScrollbarComponent,
        LicenseComponent,
    ],
    providers: [
        ModalService,
        ContactsService,
    ],
})
export class BaseModule {
}

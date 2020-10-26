import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LogoComponent} from './components/logo/logo.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {IconComponent} from './components/icon/icon.component';
import {DynamicHtmlComponent} from './components/dynamic-html/dynamic-html.component';
import {ButtonComponent} from './components/button/button.component';
import {UIRouterModule} from '@uirouter/angular';
import {TranslateModule} from '@ngx-translate/core';

export const components = {
    'wlc-logo': LogoComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-icon': IconComponent,
    'wlc-dynamic-html': DynamicHtmlComponent,
    'wlc-button': ButtonComponent,
};

@NgModule({
    declarations: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
        ButtonComponent,
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        TranslateModule,
    ],
    exports: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
        ButtonComponent,
    ],
})
export class BaseModule {
}

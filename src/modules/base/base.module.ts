import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LogoComponent} from './components/logo/logo.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import {IconComponent} from './components/icon/icon.component';
import {DynamicHtmlComponent} from './components/dynamic-html/dynamic-html.component';

export const components = {
    'wlc-logo': LogoComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-icon': IconComponent,
    'wlc-dynamic-html': DynamicHtmlComponent
};

@NgModule({
    declarations: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
        DynamicHtmlComponent,
    ]
})
export class BaseModule {
}

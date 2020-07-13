import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LogoComponent} from './components/logo/logo.component';
import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';
import { IconComponent } from './components/icon/icon.component';

export const components = {
    'wlc-logo': LogoComponent,
    'wlc-language-selector': LanguageSelectorComponent,
    'wlc-icon': IconComponent
};

@NgModule({
    declarations: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        LogoComponent,
        LanguageSelectorComponent,
        IconComponent,
    ]
})
export class BaseModule {}

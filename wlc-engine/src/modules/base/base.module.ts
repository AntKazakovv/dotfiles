import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LogoComponent} from './logo/logo.component';
import {LanguageSelectorComponent} from './language-selector/language-selector.component';

@NgModule({
    declarations: [
        LogoComponent,
        LanguageSelectorComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        LogoComponent,
        LanguageSelectorComponent,
    ]
})
export class BaseModule {}

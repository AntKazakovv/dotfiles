import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LanguageService} from './services/language/language.service';

import {LanguageSelectorComponent} from './components/language-selector/language-selector.component';

@NgModule({
    declarations: [
        LanguageSelectorComponent
    ],
    providers: [
        LanguageService
    ],
    exports: [
        LanguageSelectorComponent
    ],
    imports: [
        CommonModule
    ]
})
export class WlcLocaleModule {
}

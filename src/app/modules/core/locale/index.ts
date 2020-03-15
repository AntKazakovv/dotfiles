import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LanguageService} from './services/language/language.service';

@NgModule({
    declarations: [

    ],
    providers: [
        LanguageService
    ],
    exports: [

    ],
    imports: [
        CommonModule
    ]
})
export class WlcLocaleModule {
}

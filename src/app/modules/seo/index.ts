import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WlcCoreModule} from '../core';

import {SeoService} from './services/seo/seo.service';

@NgModule({
    declarations: [

    ],
    providers: [
        SeoService
    ],
    exports: [
        // SeoService
    ],
    imports: [
        CommonModule,
        WlcCoreModule
    ]
})
export class WlcSeoModule {
}

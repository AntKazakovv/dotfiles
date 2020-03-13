import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SeoService} from './services/seo/seo.service';

@NgModule({
    declarations: [

    ],
    providers: [
        SeoService
    ],
    imports: [
        CommonModule
    ]
})
export class WlcSeoModule {
}

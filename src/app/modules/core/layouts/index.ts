import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutsService} from './services/layouts/layouts.service';

@NgModule({
    declarations: [

    ],
    providers: [
        LayoutsService
    ],
    exports: [

    ],
    imports: [
        CommonModule
    ]
})
export class WlcLayoutsModule {
}

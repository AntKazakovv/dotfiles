import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WlcConfigModule} from './config';
import {WlcDataModule} from './data';
import {WlcEventModule} from './event';
import {WlcFormsModule} from './forms';
import {WlcLayoutsModule} from './layouts';
import {WlcLocaleModule} from './locale';
import {WlcLogModule} from './log';
import {WlcModalModule} from "./modal";
import {WlcSwiperModule} from "./swiper";
import {WlcBaseModule} from "./base";

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        WlcBaseModule,
        WlcConfigModule,
        WlcDataModule,
        WlcEventModule,
        WlcFormsModule,
        WlcLayoutsModule,
        WlcLocaleModule,
        WlcLogModule,
        WlcModalModule,
        WlcSwiperModule
    ]
})
export class WlcCoreModule {
}

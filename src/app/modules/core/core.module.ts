import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WlcConfigModule} from './config/config.module';
import {WlcDataModule} from './data/data.module';
import {WlcEventModule} from './event/event.module';
import {WlcFormsModule} from './forms/forms.module';
import {WlcLayoutsModule} from './layouts/layouts.module';
import {WlcLocaleModule} from './locale/locale.module';
import {WlcLogModule} from './log/log.module';
import {WlcModalModule} from "./modal/modal.module";
import {WlcSwiperModule} from "./swiper/swiper.module";

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        WlcConfigModule,
        WlcDataModule,
        WlcEventModule,
        WlcFormsModule,
        WlcLayoutsModule,
        WlcLocaleModule,
        WlcModalModule,
        WlcSwiperModule
    ]
})
export class WlcCoreModule {
}

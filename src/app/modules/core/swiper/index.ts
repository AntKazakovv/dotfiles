import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SwiperService} from './services/swiper/swiper.service';

@NgModule({
    declarations: [

    ],
    providers: [
        SwiperService
    ],
    exports: [

    ],
    imports: [
        CommonModule
    ]
})
export class WlcSwiperModule {
}

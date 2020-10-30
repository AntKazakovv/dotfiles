import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BannersService} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
// import {SwiperModule} from 'ngx-swiper-wrapper';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';

export const components = {
    'wlc-slider': SliderComponent,
    'wlc-banner': BannerComponent,
};

@NgModule({
    declarations: [
        SliderComponent,
        BannerComponent,
    ],
    imports: [
        CommonModule,
        BaseModule,
        // SwiperModule,
    ],
    providers: [
        BannersService,
    ],
    exports: [
        SliderComponent,
    ],
})
export class PromoModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    BannersService,
    WinnersService,
} from './services';
import {BaseModule} from 'wlc-engine/modules/base/base.module';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {UserModule} from 'wlc-engine/modules/user/user.module';

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
        SwiperModule,
        UserModule,
    ],
    providers: [
        BannersService,
        WinnersService,
    ],
    exports: [
        SliderComponent,
        BannerComponent,
    ],
})
export class PromoModule {}

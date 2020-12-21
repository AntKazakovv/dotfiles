import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    BannersService,
    WinnersService,
} from './system/services';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {UserModule} from 'wlc-engine/modules/user/user.module';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';
import {TranslateModule} from '@ngx-translate/core';
import {WinnersSliderComponent} from 'wlc-engine/modules/promo/components/winners-slider/winners-slider.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {BannersSliderComponent} from 'wlc-engine/modules/promo/components/banners-slider/banners-slider.component';

export const components = {
    'wlc-slider': SliderComponent,
    'wlc-banner': BannerComponent,
    'wlc-winners-slider': WinnersSliderComponent,
    'wlc-banners-slider': BannersSliderComponent,
};

@NgModule({
    declarations: [
        SliderComponent,
        BannerComponent,
        WinnerComponent,
        WinnersSliderComponent,
        BannersSliderComponent,
    ],
    imports: [
        CommonModule,
        SwiperModule,
        UserModule,
        TranslateModule,
        CoreModule,
    ],
    providers: [
        BannersService,
        WinnersService,
    ],
    exports: [
        SliderComponent,
        BannerComponent,
        WinnerComponent,
        WinnersSliderComponent,
        BannersSliderComponent,
    ],
})
export class PromoModule {}

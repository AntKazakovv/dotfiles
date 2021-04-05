import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {
    BannersService,
    WinnersService,
} from './system/services';
import {SwiperModule} from 'swiper/angular';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';
import {TranslateModule} from '@ngx-translate/core';
import {WinnersSliderComponent} from 'wlc-engine/modules/promo/components/winners-slider/winners-slider.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {BannersSliderComponent} from 'wlc-engine/modules/promo/components/banners-slider/banners-slider.component';
import {AngularResizedEventModule} from 'angular-resize-event';
import {JackpotsSliderComponent} from 'wlc-engine/modules/promo/components/jackpots-slider/jackpots-slider.component';
import {JackpotComponent} from 'wlc-engine/modules/promo/components/jackpot/jackpot.component';

export const components = {
    'wlc-banner': BannerComponent,
    'wlc-banners-slider': BannersSliderComponent,
    'wlc-jackpot': JackpotComponent,
    'wlc-jackpots-slider': JackpotsSliderComponent,
    'wlc-slider': SliderComponent,
    'wlc-winners-slider': WinnersSliderComponent,
};

@NgModule({
    declarations: [
        SliderComponent,
        BannerComponent,
        WinnerComponent,
        WinnersSliderComponent,
        BannersSliderComponent,
        JackpotsSliderComponent,
        JackpotComponent,
    ],
    imports: [
        CommonModule,
        SwiperModule,
        TranslateModule,
        CoreModule,
        AngularResizedEventModule,
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
        JackpotsSliderComponent,
        JackpotComponent,
    ],
})
export class PromoModule {}

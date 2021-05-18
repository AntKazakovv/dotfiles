import {AngularResizedEventModule} from 'angular-resize-event';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SwiperModule} from 'swiper/angular';
import {TranslateModule} from '@ngx-translate/core';

import {
    BannersService,
    LoyaltyLevelsService,
    WinnersService,
} from './system/services';

import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';
import {BannersSliderComponent} from 'wlc-engine/modules/promo/components/banners-slider/banners-slider.component';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {JackpotComponent} from 'wlc-engine/modules/promo/components/jackpot/jackpot.component';
import {JackpotsSliderComponent} from 'wlc-engine/modules/promo/components/jackpots-slider/jackpots-slider.component';
import {LoyaltyInfoComponent} from 'wlc-engine/modules/promo/components/loyalty-info/loyalty-info.component';
import {LoyaltyLevelsComponent} from 'wlc-engine/modules/promo/components/loyalty-levels/loyalty-levels.component';
import {LoyaltyProgramComponent} from 'wlc-engine/modules/promo/components/loyalty-program/loyalty-program.component';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {StaticModule} from 'wlc-engine/modules/static/static.module';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';
import {WinnersSliderComponent} from 'wlc-engine/modules/promo/components/winners-slider/winners-slider.component';

export const components = {
    'wlc-banner': BannerComponent,
    'wlc-banners-slider': BannersSliderComponent,
    'wlc-jackpot': JackpotComponent,
    'wlc-jackpots-slider': JackpotsSliderComponent,
    'wlc-loyalty-info': LoyaltyInfoComponent,
    'wlc-loyalty-levels': LoyaltyLevelsComponent,
    'wlc-loyalty-program': LoyaltyProgramComponent,
    'wlc-slider': SliderComponent,
    'wlc-winners-slider': WinnersSliderComponent,
};

@NgModule({
    declarations: [
        BannerComponent,
        BannersSliderComponent,
        JackpotComponent,
        JackpotsSliderComponent,
        LoyaltyInfoComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
    ],
    imports: [
        AngularResizedEventModule,
        CommonModule,
        CoreModule,
        StaticModule,
        SwiperModule,
        TranslateModule,
    ],
    providers: [
        BannersService,
        LoyaltyLevelsService,
        WinnersService,
    ],
    exports: [
        BannerComponent,
        BannersSliderComponent,
        JackpotsSliderComponent,
        JackpotComponent,
        LoyaltyInfoComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
    ],
})
export class PromoModule {
}

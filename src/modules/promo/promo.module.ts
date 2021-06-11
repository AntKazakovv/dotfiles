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
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {StaticModule} from 'wlc-engine/modules/static/static.module';
import {
    WinnersSliderComponent,
    WinnerComponent,
    SliderComponent,
    LoyaltyProgramComponent,
    LoyaltyLevelsComponent,
    LoyaltyInfoComponent,
    JackpotsSliderComponent,
    JackpotComponent,
    BannersSliderComponent,
    BannerComponent,
} from 'wlc-engine/modules/promo';
import {CompilerModule} from 'wlc-engine/modules/compiler';

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
        CompilerModule,
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

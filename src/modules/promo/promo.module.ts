import {AngularResizeEventModule} from 'angular-resize-event';
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
    LoyaltyLevelComponent,
    LoyaltyLevelsComponent,
    LoyaltyInfoComponent,
    JackpotsSliderComponent,
    JackpotComponent,
    BannersSliderComponent,
    BannerComponent,
    LevelNameComponent,
    IPromoConfig,
    CashOutTimeComponent,
    TopRatedComponent,
} from 'wlc-engine/modules/promo';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {GlobalHelper} from '../core/system/helpers';
import {promoConfig} from './system/config/promo.config';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IPromoConfig>(promoConfig, _get($config, '$promo', {}));

export const components = {
    'wlc-banner': BannerComponent,
    'wlc-banners-slider': BannersSliderComponent,
    'wlc-cash-out-time': CashOutTimeComponent,
    'wlc-jackpot': JackpotComponent,
    'wlc-jackpots-slider': JackpotsSliderComponent,
    'wlc-loyalty-info': LoyaltyInfoComponent,
    'wlc-loyalty-level': LoyaltyLevelComponent,
    'wlc-loyalty-levels': LoyaltyLevelsComponent,
    'wlc-loyalty-program': LoyaltyProgramComponent,
    'wlc-slider': SliderComponent,
    'wlc-winners-slider': WinnersSliderComponent,
    'wlc-level-name': LevelNameComponent,
    'wlc-top-rated': TopRatedComponent,
};

@NgModule({
    declarations: [
        BannerComponent,
        BannersSliderComponent,
        CashOutTimeComponent,
        JackpotComponent,
        JackpotsSliderComponent,
        LoyaltyInfoComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
        LevelNameComponent,
        TopRatedComponent,
    ],
    imports: [
        AngularResizeEventModule,
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
        CashOutTimeComponent,
        JackpotsSliderComponent,
        JackpotComponent,
        LoyaltyInfoComponent,
        LoyaltyLevelComponent,
        LoyaltyLevelsComponent,
        LoyaltyProgramComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
        LevelNameComponent,
        TopRatedComponent,
    ],
})
export class PromoModule {
}

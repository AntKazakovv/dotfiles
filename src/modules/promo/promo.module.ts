import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {NgModule} from '@angular/core';
import {SwiperModule} from 'swiper/angular';
import {TranslateModule} from '@ngx-translate/core';

import {
    BannersService,
    WinnersService,
} from './system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {StaticModule} from 'wlc-engine/modules/static/static.module';
import {
    WinnersSliderComponent,
    WinnerComponent,
    SliderComponent,
    JackpotsSliderComponent,
    JackpotComponent,
    BannersSliderComponent,
    BannerComponent,
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
    'wlc-slider': SliderComponent,
    'wlc-winners-slider': WinnersSliderComponent,
    'wlc-top-rated': TopRatedComponent,
};

@NgModule({
    declarations: [
        BannerComponent,
        BannersSliderComponent,
        CashOutTimeComponent,
        JackpotComponent,
        JackpotsSliderComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
        TopRatedComponent,
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        CoreModule,
        StaticModule,
        SwiperModule,
        TranslateModule,
        CompilerModule,
    ],
    providers: [
        BannersService,
        WinnersService,
    ],
    exports: [
        BannerComponent,
        BannersSliderComponent,
        CashOutTimeComponent,
        JackpotsSliderComponent,
        JackpotComponent,
        SliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
        TopRatedComponent,
    ],
})
export class PromoModule {
}

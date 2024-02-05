import {CommonModule} from '@angular/common';
import {UIRouterModule} from '@uirouter/angular';
import {NgModule} from '@angular/core';
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
    JackpotsSliderComponent,
    JackpotComponent,
    BannersSliderComponent,
    BannerComponent,
    IPromoConfig,
    CashOutTimeComponent,
    TopRatedComponent,
} from 'wlc-engine/modules/promo';
import {LatestBetsComponent} from 'wlc-engine/modules/promo/components/latest-bets/latest-bets.component';
import {LatestBetsItemComponent} from 'wlc-engine/modules/promo/components/latest-bets-item/latest-bets-item.component';
import {BetInfoComponent} from 'wlc-engine/modules/promo/components/bet-info/bet-info.component';

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
    'wlc-winners-slider': WinnersSliderComponent,
    'wlc-top-rated': TopRatedComponent,
    'wlc-latest-bets': LatestBetsComponent,
    'wlc-latest-bets-item': LatestBetsItemComponent,
    'wlc-bet-info': BetInfoComponent,
};

export const services = {
    'banners-service': BannersService,
};

@NgModule({
    declarations: [
        BannerComponent,
        BannersSliderComponent,
        CashOutTimeComponent,
        JackpotComponent,
        JackpotsSliderComponent,
        WinnerComponent,
        WinnersSliderComponent,
        TopRatedComponent,
        LatestBetsComponent,
        LatestBetsItemComponent,
        BetInfoComponent,
    ],
    imports: [
        CommonModule,
        UIRouterModule,
        CoreModule,
        StaticModule,
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
        WinnerComponent,
        WinnersSliderComponent,
        TopRatedComponent,
        LatestBetsComponent,
        LatestBetsItemComponent,
        BetInfoComponent,
    ],
})
export class PromoModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {UIRouterModule} from '@uirouter/angular';

import {CoreModule} from '../core/core.module';
import {PromoModule} from '../promo/promo.module';
import {CompilerModule} from '../compiler/compiler.module';

import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {BonusesHistoryComponent} from './components/bonuses-history/bonuses-history.component';
import {BonusModalComponent} from './components/bonus-modal/bonus-modal.component';
import {BonusButtonsComponent} from './components/bonus-buttons/bonus-buttons.component';
import {EnterPromocodeComponent} from './components/enter-promocode/enter-promocode.component';
import {GameDashboardBonusesComponent} from './components/game-dashboard-bonuses/game-dashboard-bonuses.component';
import {PromoSuccessComponent} from './components/promo-success/promo-success.component';
import {RecommendedBonusesComponent} from './components/recommended-bonuses/recommended-bonuses.component';
import {DepositBonusesComponent} from './components/deposit-bonuses/deposit-bonuses.component';
import {BonusesService} from './system/services/bonuses/bonuses.service';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {IBonusesModule} from './system/interfaces/bonuses.interface';
import {bonusesConfig} from './system/config/bonuses.config';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig = GlobalHelper.mergeConfig<IBonusesModule>(bonusesConfig, _get($config, '$bonuses', {}));

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-bonus-modal': BonusModalComponent,
    'wlc-bonus-buttons': BonusButtonsComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-game-dashboard-bonuses': GameDashboardBonusesComponent,
    'wlc-promo-success': PromoSuccessComponent,
    'wlc-recommended-bonuses': RecommendedBonusesComponent,
    'wlc-deposit-bonuses': DepositBonusesComponent,
};

export const services = {
    'bonuses-service': BonusesService,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        BonusesHistoryComponent,
        BonusModalComponent,
        BonusButtonsComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
        GameDashboardBonusesComponent,
        RecommendedBonusesComponent,
        DepositBonusesComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        PromoModule,
        TranslateModule,
        UIRouterModule,
        CompilerModule,
    ],
    providers: [
        BonusesService,
    ],
    exports: [
        BonusItemComponent,
        BonusesListComponent,
        BonusesHistoryComponent,
        BonusModalComponent,
        BonusButtonsComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
        GameDashboardBonusesComponent,
        RecommendedBonusesComponent,
    ],
})

export class BonusesModule {
}

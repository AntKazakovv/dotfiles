import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {UIRouterModule} from '@uirouter/angular';

import {CoreModule} from '../core/core.module';
import {PromoModule} from '../promo/promo.module';

import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {BonusesHistoryComponent} from './components/bonuses-history/bonuses-history.component';
import {EnterPromocodeComponent} from './components/enter-promocode/enter-promocode.component';
import {GameDashboardBonusesComponent} from './components/game-dashboard-bonuses/game-dashboard-bonuses.component';
import {PromoSuccessComponent} from './components/promo-success/promo-success.component';
import {RecommendedBonusesComponent} from './components/recommended-bonuses/recommended-bonuses.component';
import {BonusesService} from './system/services/bonuses/bonuses.service';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-game-dashboard-bonuses': GameDashboardBonusesComponent,
    'wlc-promo-success': PromoSuccessComponent,
    'wlc-recommended-bonuses': RecommendedBonusesComponent,
};

export const services = {
    'bonuses-service': BonusesService,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        BonusesHistoryComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
        GameDashboardBonusesComponent,
        RecommendedBonusesComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        PromoModule,
        TranslateModule,
        UIRouterModule,
    ],
    providers: [
        BonusesService,
    ],
    exports: [
        BonusItemComponent,
        BonusesListComponent,
        BonusesHistoryComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
        GameDashboardBonusesComponent,
        RecommendedBonusesComponent,
    ],
})

export class BonusesModule {
}

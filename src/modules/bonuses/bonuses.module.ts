import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {UIRouterModule} from '@uirouter/angular';

import {CoreModule} from '../core/core.module';
import {PromoModule} from '../promo/promo.module';

import {
    BonusItemComponent,
    BonusesHistoryComponent,
    BonusesListComponent,
    EnterPromocodeComponent,
    GameDashboardBonusesComponent,
    PromoSuccessComponent,
    RecommendedBonusesComponent,
    BonusesService,
} from 'wlc-engine/modules/bonuses';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-game-dashboard-bonuses': GameDashboardBonusesComponent,
    'wlc-promo-success': PromoSuccessComponent,
    'wlc-recommended-bonuses': RecommendedBonusesComponent,
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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from '../core/core.module';
import {PromoModule} from '../promo/promo.module';
import {BonusesService} from './system/services';

import {BonusItemComponent} from './components/bonus-item/bonus-item.component';
import {BonusesHistoryComponent} from './components/bonuses-history/bonuses-history.component';
import {BonusesListComponent} from './components/bonuses-list/bonuses-list.component';
import {EnterPromocodeComponent} from './components/enter-promocode/enter-promocode.component';
import {GameDashboardBonusesComponent} from './components/game-dashboard-bonuses/game-dashboard-bonuses.component';
import {PromoSuccessComponent} from './components/promo-success/promo-success.component';

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-game-dashboard-bonuses': GameDashboardBonusesComponent,
    'wlc-promo-success': PromoSuccessComponent,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        BonusesHistoryComponent,
        EnterPromocodeComponent,
        PromoSuccessComponent,
        GameDashboardBonusesComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        PromoModule,
        TranslateModule,
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
    ],
})

export class BonusesModule {
}

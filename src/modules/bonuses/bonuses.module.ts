import {NgModule} from '@angular/core';
import {UIRouterModule} from '@uirouter/angular';

import _get from 'lodash-es/get';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {PromoModule} from 'wlc-engine/modules/promo/promo.module';
import {CompilerModule} from 'wlc-engine/modules/compiler/compiler.module';

import {BonusItemComponent} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.component';
import {BonusesListComponent} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.component';
import {BonusModalComponent} from 'wlc-engine/modules/bonuses/components/bonus-modal/bonus-modal.component';
import {BonusButtonsComponent} from 'wlc-engine/modules/bonuses/components/bonus-buttons/bonus-buttons.component';
import {EnterPromocodeComponent} from 'wlc-engine/modules/bonuses/components/enter-promocode/enter-promocode.component';
import {
    GameDashboardBonusesComponent,
} from 'wlc-engine/modules/bonuses/components/game-dashboard-bonuses/game-dashboard-bonuses.component';
import {LootboxPrizeComponent} from 'wlc-engine/modules/bonuses/components/lootbox-prize/lootbox-prize.component';
import {LootboxModalComponent} from 'wlc-engine/modules/bonuses/components/lootbox-modal/lootbox-modal.component';
import {PromoSuccessComponent} from 'wlc-engine/modules/bonuses/components/promo-success/promo-success.component';
import {
    RecommendedBonusesComponent,
} from 'wlc-engine/modules/bonuses/components/recommended-bonuses/recommended-bonuses.component';
import {BonusWagerComponent} from 'wlc-engine/modules/bonuses/components/bonus-wager/bonus-wager.component';
import {DepositBonusesComponent} from 'wlc-engine/modules/bonuses/components/deposit-bonuses/deposit-bonuses.component';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {IBonusesModule} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {bonusesConfig} from 'wlc-engine/modules/bonuses/system/config/bonuses/bonuses.config';
import * as $config from 'wlc-config/index';
import {
    BonusConfirmationComponent,
} from './components/bonus-buttons/components/bonus-confirmation/bonus-confirmation.component';
import {
    BonusChoiceModalComponent,
} from 'wlc-engine/modules/bonuses/components/bonus-choice-modal/bonus-choice-modal.component';
import {PromoCodeService} from 'wlc-engine/modules/bonuses/system/services/promocode/promocode.service';

export const moduleConfig = GlobalHelper.mergeConfig<IBonusesModule>(bonusesConfig, _get($config, '$bonuses', {}));

export const components = {
    'wlc-bonus-item': BonusItemComponent,
    'wlc-bonuses-list': BonusesListComponent,
    'wlc-bonus-modal': BonusModalComponent,
    'wlc-bonus-buttons': BonusButtonsComponent,
    'wlc-enter-promocode': EnterPromocodeComponent,
    'wlc-game-dashboard-bonuses': GameDashboardBonusesComponent,
    'wlc-lootbox-modal': LootboxModalComponent,
    'wlc-lootbox-prize': LootboxPrizeComponent,
    'wlc-promo-success': PromoSuccessComponent,
    'wlc-recommended-bonuses': RecommendedBonusesComponent,
    'wlc-deposit-bonuses': DepositBonusesComponent,
    'wlc-bonus-wager': BonusWagerComponent,
    'wlc-bonus-choice-modal': BonusChoiceModalComponent,
};

export const services = {
    'bonuses-service': BonusesService,
    'promocode-service': PromoCodeService,
};

@NgModule({
    declarations: [
        BonusItemComponent,
        BonusesListComponent,
        BonusModalComponent,
        BonusButtonsComponent,
        EnterPromocodeComponent,
        GameDashboardBonusesComponent,
        LootboxModalComponent,
        LootboxPrizeComponent,
        PromoSuccessComponent,
        RecommendedBonusesComponent,
        DepositBonusesComponent,
        BonusConfirmationComponent,
        BonusWagerComponent,
        BonusChoiceModalComponent,
    ],
    imports: [
        CoreModule,
        PromoModule,
        UIRouterModule,
        CompilerModule,
    ],
    providers: [
        BonusesService,
        PromoCodeService,
    ],
    exports: [
        BonusItemComponent,
        BonusesListComponent,
        BonusModalComponent,
        BonusButtonsComponent,
        EnterPromocodeComponent,
        GameDashboardBonusesComponent,
        LootboxModalComponent,
        LootboxPrizeComponent,
        PromoSuccessComponent,
        RecommendedBonusesComponent,
        BonusWagerComponent,
        BonusChoiceModalComponent,
    ],
})

export class BonusesModule {
}

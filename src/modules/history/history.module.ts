import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {BonusesHistoryComponent} from 'wlc-engine/modules/history/components/bonuses-history/bonuses-history.component';
import {BetHistoryComponent} from 'wlc-engine/modules/history/components/bet-history/bet-history.component';
import {BetPreviewComponent} from 'wlc-engine/modules/history/components/bet-history/bet-preview/bet-preview.component';
import {
    TransactionHistoryComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-history.component';
import {
    TransactionButtonsComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-buttons/transaction-buttons.component';
import {
    TransactionPreviewComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-preview/transaction-preview.component';
import {
    TransactionStatusComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-status/transaction-status.component';
import {HistoryRangeComponent} from 'wlc-engine/modules/history/components/history-range/history-range.component';

import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {HistoryFilterService} from 'wlc-engine/modules/history/system/services/history-filter.service';
import {TournamentsHistoryComponent} from './components/tournaments-history/tournaments-history.component';
import {
    TournamentTopwinsBtnComponent,
} from './components/tournaments-history/components/tournament-topwins-btn/tournament-topwins-btn.component';
import {
    CashbackHistoryComponent,
} from 'wlc-engine/modules/history/components/cashback-history/cashback-history.component';
import {
    CashbackPreviewComponent,
} from 'wlc-engine/modules/history/components/cashback-history/cashback-preview/cashback-preview.component';

export const components = {
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-tournaments-history': TournamentsHistoryComponent,
    'wlc-bet-history': BetHistoryComponent,
    'wlc-transaction-history': TransactionHistoryComponent,
    'wlc-history-range': HistoryRangeComponent,
    'wlc-cashback-history': CashbackHistoryComponent,
};

export const services = {
    'history-service': HistoryService,
    'history-filter': HistoryFilterService,
};

@NgModule({
    declarations: [
        BonusesHistoryComponent,
        TournamentsHistoryComponent,
        TournamentTopwinsBtnComponent,
        BetHistoryComponent,
        CashbackHistoryComponent,
        CashbackPreviewComponent,
        BetPreviewComponent,
        TransactionHistoryComponent,
        TransactionButtonsComponent,
        TransactionPreviewComponent,
        TransactionStatusComponent,
        HistoryRangeComponent,

    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
    ],
    providers: [
        HistoryService,
        HistoryFilterService,
    ],
    exports: [
        BonusesHistoryComponent,
        TournamentsHistoryComponent,
        BetHistoryComponent,
        CashbackHistoryComponent,
        CashbackPreviewComponent,
        BetPreviewComponent,
        TransactionHistoryComponent,
        TransactionButtonsComponent,
        TransactionPreviewComponent,
        TransactionStatusComponent,
        HistoryRangeComponent,
    ],
})

export class HistoryModule {
}

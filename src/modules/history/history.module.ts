import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {BonusesHistoryComponent} from 'wlc-engine/modules/history/components/bonuses-history/bonuses-history.component';
import {BetHistoryComponent} from 'wlc-engine/modules/history/components/bet-history/bet-history.component';
import {HistoryNameComponent} from 'wlc-engine/modules/history/components/history-name/history-name.component';
import {
    TransactionHistoryComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-history.component';
import {
    TransactionButtonsComponent,
} from 'wlc-engine/modules/history/components/transaction-history/transaction-buttons/transaction-buttons.component';
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
import {HistoryFilterComponent} from './components/history-filter/history-filter.component';
import {
    HistoryFilterFormComponent,
} from './components/history-filter/history-filter-form/history-filter-form.component';

export const components = {
    'wlc-bonuses-history': BonusesHistoryComponent,
    'wlc-tournaments-history': TournamentsHistoryComponent,
    'wlc-bet-history': BetHistoryComponent,
    'wlc-transaction-history': TransactionHistoryComponent,
    'wlc-history-range': HistoryRangeComponent,
    'wlc-cashback-history': CashbackHistoryComponent,
    'wlc-history-name': HistoryNameComponent,
    'wlc-history-filter': HistoryFilterComponent,
    'wlc-history-filter-form': HistoryFilterFormComponent,
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
        HistoryNameComponent,
        TransactionHistoryComponent,
        TransactionButtonsComponent,
        TransactionStatusComponent,
        HistoryRangeComponent,
        HistoryFilterComponent,
        HistoryFilterFormComponent,
    ],
    imports: [
        CoreModule,
    ],
    providers: [
        HistoryService,
        HistoryFilterService,
    ],
    exports: [
        BonusesHistoryComponent,
        TournamentsHistoryComponent,
        HistoryNameComponent,
        BetHistoryComponent,
        CashbackHistoryComponent,
        CashbackPreviewComponent,
        TransactionHistoryComponent,
        TransactionButtonsComponent,
        TransactionStatusComponent,
        HistoryRangeComponent,
        HistoryFilterComponent,
        HistoryFilterFormComponent,
    ],
})

export class HistoryModule {
}

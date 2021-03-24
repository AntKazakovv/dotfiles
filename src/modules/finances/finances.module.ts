import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    FinancesService,
    HistoryFilterService,
} from './system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {TranslateModule} from '@ngx-translate/core';
import {BetHistoryComponent} from './components/bet-history/bet-history.component';
import {DepositWithdrawComponent} from './components/deposit-withdraw/deposit-withdraw.component';
import {TransactionHistoryComponent} from './components/transaction-history/transaction-history.component';
import {TransactionStatusComponent} from './components/transaction-history/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from './components/transaction-history/transaction-cancel/transaction-cancel.component';
import {TransactionPreviewComponent} from './components/transaction-history/transaction-preview/transaction-preview.component';
import {HistoryFilterComponent} from './components/history-filter/history-filter.component';
import {HistoryFilterFormComponent} from './components/history-filter/history-filter-form/history-filter-form.component';
import {HistoryRangeComponent} from './components/transaction-range/history-range.component';
import {PaymentListComponent} from './components/payment-list/payment-list.component';
import {CryptoDataComponent} from './components/crypto-data/crypto-data.component';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {financesConfig} from './system/config/finances.config';
import {IFinancesConfig} from './system/interfaces/finances.interface';
import {AddProfileInfoComponent} from 'wlc-engine/modules/finances/components/deposit-withdraw/add-profile-info';
import * as $config from 'wlc-config/index';

import {
    get as _get,
} from 'lodash-es';

export const moduleConfig =
    GlobalHelper.mergeConfig<IFinancesConfig>(financesConfig, _get($config, '$finances', {}));

export const components = {
    'wlc-bet-history': BetHistoryComponent,
    'wlc-deposit-withdraw': DepositWithdrawComponent,
    'wlc-history-filter': HistoryFilterComponent,
    'wlc-history-range': HistoryRangeComponent,
    'wlc-payment-list': PaymentListComponent,
    'wlc-transaction-history': TransactionHistoryComponent,
};

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        AddProfileInfoComponent,
        BetHistoryComponent,
        CryptoDataComponent,
        DepositWithdrawComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
        TransactionStatusComponent,
        TransactionCancelComponent,
        TransactionPreviewComponent,
        HistoryFilterComponent,
        HistoryFilterFormComponent,
        HistoryRangeComponent,
    ],
    providers: [
        FinancesService,
        HistoryFilterService,
    ],
    exports: [
        BetHistoryComponent,
        DepositWithdrawComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
        HistoryRangeComponent,
    ],
})
export class FinancesModule {
}

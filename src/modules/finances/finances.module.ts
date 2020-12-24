import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinancesService} from './system/services/finances/finances.service';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {TranslateModule} from '@ngx-translate/core';
import {DepositWithdrawComponent} from './components/deposit-withdraw/deposit-withdraw.component';
import {PaymentListComponent} from './components/payment-list/payment-list.component';
import {TransactionHistoryComponent} from './components/transaction-history/transaction-history.component';
import {TransactionStatusComponent} from './components/transaction-history/transaction-status/transaction-status.component';
import {TransactionCancelComponent} from './components/transaction-history/transaction-cancel/transaction-cancel.component';

import {GlobalHelper} from 'wlc-engine/modules/core/index';
import {financesConfig} from './system/config/finances.config';
import {IFinancesConfig} from './system/interfaces/finances.interface';
import * as $config from 'wlc-config/index';

import {
    get as _get,
} from 'lodash';

export const moduleConfig =
    GlobalHelper.mergeConfig<IFinancesConfig>(financesConfig, _get($config, '$finances', {}));

export const components = {
    'wlc-deposit-withdraw': DepositWithdrawComponent,
    'wlc-payment-list': PaymentListComponent,
    'wlc-transaction-history': TransactionHistoryComponent,
};

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
    ],
    declarations: [
        DepositWithdrawComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
        TransactionStatusComponent,
        TransactionCancelComponent,
    ],
    providers: [
        FinancesService,
    ],
    exports: [
        DepositWithdrawComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
    ],
})
export class FinancesModule {
}

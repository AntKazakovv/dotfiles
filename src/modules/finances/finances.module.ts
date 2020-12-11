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

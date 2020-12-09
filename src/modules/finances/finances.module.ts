import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FinancesService} from './system/services/finances/finances.service';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {TranslateModule} from '@ngx-translate/core';
import {DepositComponent} from './components/deposit/deposit.component';
import {PaymentListComponent} from './components/payment-list/payment-list.component';
import {TransactionHistoryComponent} from './components/transaction-history/transaction-history.component';
import { TransactionStatusComponent } from './components/transaction-status/transaction-status.component';
import { TransactionCancelComponent } from './components/transaction-cancel/transaction-cancel.component';

export const components = {
    'wlc-deposit': DepositComponent,
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
        DepositComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
        TransactionStatusComponent,
        TransactionCancelComponent,
    ],
    providers: [
        FinancesService,
    ],
    exports: [
        DepositComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
    ],
})
export class FinancesModule {
}

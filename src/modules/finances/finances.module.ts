import {UIRouterModule} from '@uirouter/angular';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    FinancesService,
    PIQCashierService,
} from './system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IconListModule} from 'wlc-engine/modules/icon-list/icon-list.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';
import {TranslateModule} from '@ngx-translate/core';
import {DepositWithdrawComponent} from './components/deposit-withdraw/deposit-withdraw.component';
import {TransactionHistoryComponent} from './components/transaction-history/transaction-history.component';
import {
    TransactionStatusComponent,
} from './components/transaction-history/transaction-status/transaction-status.component';
import {
    TransactionButtonsComponent,
} from './components/transaction-history/transaction-buttons/transaction-buttons.component';
import {
    TransactionPreviewComponent,
} from './components/transaction-history/transaction-preview/transaction-preview.component';
import {PaymentListComponent} from './components/payment-list/payment-list.component';
import {PaymentMessageComponent} from './components/payment-message/payment-message.component';
import {PIQCashierComponent} from './components/piq-cashier/piq-cashier.component';
import {IframeDepositComponent} from './components/iframe-deposit/iframe-deposit.component';
import {PreselectedAmountsComponent} 
    from './components/deposit-withdraw/components/preselected-amounts/preselected-amounts.component';
import {ClearAmountButtonComponent} 
    from './components/deposit-withdraw/components/clear-amount-button/clear-amount-button.component';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {financesConfig} from './system/config/finances.config';
import {IFinancesConfig} from './system/interfaces/finances.interface';
import {MultiWalletModule} from 'wlc-engine/modules/multi-wallet/multi-wallet.module';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IFinancesConfig>(financesConfig, _get($config, '$finances', {}));

export const components = {
    'wlc-deposit-withdraw': DepositWithdrawComponent,
    'wlc-payment-list': PaymentListComponent,
    'wlc-transaction-history': TransactionHistoryComponent,
    'wlc-iframe-deposit': IframeDepositComponent,
    'wlc-piq-cashier': PIQCashierComponent,
    'wlc-preselected-amounts': PreselectedAmountsComponent,
    'wlc-clear-amount-button': ClearAmountButtonComponent,
};

export const services = {
    'finances-service': FinancesService,
};

@NgModule({
    imports: [
        UIRouterModule,
        CommonModule,
        CompilerModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        IconListModule,
        MultiWalletModule,
    ],
    declarations: [
        PaymentMessageComponent,
        DepositWithdrawComponent,
        PaymentListComponent,
        PIQCashierComponent,
        TransactionHistoryComponent,
        TransactionStatusComponent,
        TransactionButtonsComponent,
        TransactionPreviewComponent,
        IframeDepositComponent,
        PreselectedAmountsComponent,
        ClearAmountButtonComponent,
    ],
    providers: [
        FinancesService,
        PIQCashierService,
    ],
    exports: [
        DepositWithdrawComponent,
        PaymentListComponent,
        TransactionHistoryComponent,
        TranslateModule,
    ],
})
export class FinancesModule {
}

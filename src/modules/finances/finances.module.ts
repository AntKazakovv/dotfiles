import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {NgModule} from '@angular/core';
import {
    FinancesService,
    PIQCashierService,
} from './system/services';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IconListModule} from 'wlc-engine/modules/icon-list/icon-list.module';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {DepositWithdrawComponent} from './components/deposit-withdraw/deposit-withdraw.component';
import {PaymentListComponent} from './components/payment-list/payment-list.component';
import {PaymentMessageComponent} from './components/payment-message/payment-message.component';
import {PIQCashierComponent} from './components/piq-cashier/piq-cashier.component';
import {IframeDepositComponent} from './components/iframe-deposit/iframe-deposit.component';
import {FastDepositComponent} from './components/fast-deposit/fast-deposit.component';
import {PaymentFormComponent} from './components/payment-form/payment-form.component';
import {DepositPromocodeComponent}
    from './components/deposit-withdraw/components/deposit-promocode/deposit-promocode.component';
import {PreselectedAmountsComponent}
    from './components/deposit-withdraw/components/preselected-amounts/preselected-amounts.component';
import {ClearAmountButtonComponent}
    from './components/deposit-withdraw/components/clear-amount-button/clear-amount-button.component';
import {WithdrawInfoComponent} from './components/withdraw-info/withdraw-info.component';
import {WithdrawCancelWidgetComponent} from './components/withdraw-cancel-widget/withdraw-cancel-widget.component';
import {DepWagerComponent} from './components/dep-wager/dep-wager.component';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {financesConfig} from './system/config/finances.config';
import {IFinancesConfig} from './system/interfaces/finances.interface';
import * as $config from 'wlc-config/index';

import _get from 'lodash-es/get';

export const moduleConfig =
    GlobalHelper.mergeConfig<IFinancesConfig>(financesConfig, _get($config, '$finances', {}));

export const components = {
    'wlc-tax-info': TaxInfoComponent,
    'wlc-deposit-withdraw': DepositWithdrawComponent,
    'wlc-payment-list': PaymentListComponent,
    'wlc-iframe-deposit': IframeDepositComponent,
    'wlc-piq-cashier': PIQCashierComponent,
    'wlc-preselected-amounts': PreselectedAmountsComponent,
    'wlc-clear-amount-button': ClearAmountButtonComponent,
    'wlc-payment-form': PaymentFormComponent,
    'wlc-fast-deposit': FastDepositComponent,
    'wlc-deposit-promocode': DepositPromocodeComponent,
    'wlc-withdraw-info': WithdrawInfoComponent,
    'wlc-withdraw-cancel': WithdrawCancelWidgetComponent,
    'wlc-dep-wager': DepWagerComponent,
};

export const services = {
    'finances-service': FinancesService,
};

@NgModule({
    imports: [
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        IconListModule,
    ],
    declarations: [
        PaymentMessageComponent,
        DepositWithdrawComponent,
        PaymentListComponent,
        PIQCashierComponent,
        IframeDepositComponent,
        PreselectedAmountsComponent,
        ClearAmountButtonComponent,
        PaymentFormComponent,
        FastDepositComponent,
        TaxInfoComponent,
        DepositPromocodeComponent,
        WithdrawInfoComponent,
        WithdrawCancelWidgetComponent,
        DepWagerComponent,
    ],
    providers: [
        FinancesService,
        PIQCashierService,
    ],
    exports: [
        DepositWithdrawComponent,
        PaymentListComponent,
        WithdrawCancelWidgetComponent,
        DepWagerComponent,
    ],
})
export class FinancesModule {
}

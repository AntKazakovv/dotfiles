import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IPaymentFormCParams} from 'wlc-engine/modules/finances/components/payment-form/payment-form.params';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IFastDepositCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    paymentFormParams?: IPaymentFormCParams;
    paymentListParams?: IPaymentListCParams;
    textConfig?: {
        description?: string;
        systemUnavailable?: string;
    },
    linkParams?: {
        text?: string;
        iconPath?: string;
    }
};

export const defaultParams: IFastDepositCParams = {
    class: 'wlc-fast-deposit',
    componentName: 'wlc-fast-deposit',
    moduleName: 'finances',
    textConfig: {
        description: gettext('The chosen payment method:'),
        systemUnavailable:
            gettext('The balance is running out and can be exhausted soon. ' +
            'Go to the "Deposit" page to make a payment and receive additional bonuses.'),
    },
    paymentFormParams: {
        mode: 'deposit',
        themeMod: 'centered',
        showPaymentRules: true,
        hideClearAmountButton: true,
        paymentMessageParams: {
            themeMod: 'modal',
        },
    },
    paymentListParams: {
        type: 'fast-deposit',
    },
    linkParams: {
        text: gettext('Go to the deposit page'),
        iconPath: '/wlc/icons/arrow-right.svg',
    },
};

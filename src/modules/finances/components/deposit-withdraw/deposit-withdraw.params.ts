import {IDepositBonusesCParams} from 'wlc-engine/modules/bonuses';
import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectCParams,
    ICheckboxCParams,
    ITimerCParams,
} from 'wlc-engine/modules/core';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.component';
import {
    IDepositPromoCodeCParams,
} from 'wlc-engine/modules/finances/components/deposit-withdraw/components/deposit-promocode/deposit-promocode.params';
import {IPaymentFormCParams} from 'wlc-engine/modules/finances/components/payment-form/payment-form.params';
import {IPaymentListCParams} from 'wlc-engine/modules/finances/components/payment-list/payment-list.params';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

/**
 * default - one column template
 * second - two columns template (payments in left column)
 * steps - mobile template
 */
export type Theme = 'default' | 'second' | 'steps' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export type TStepTplName = 'wallets' | 'bonuses' | 'systems' | 'paymentInfo' | 'cryptoInvoiceSystems';

export interface IDepositWithdrawCParams extends IComponentParams<Theme, Type, ThemeMod> {
    mode: TPaymentsMethods;
    /** show/hide payment rules checkbox */
    showPaymentRules?: boolean;
    common?: {
        themeMod?: ThemeMod;
    };
    /** Params for timer element */
    timerParams?: ITimerCParams; // move to payment-form

    /** Params for CryptoCurrencies list */
    cryptoListParams?: IPaymentListCParams;
    /** Array for sorting steps (used with default template only) */
    stepsOrder?: Array<Exclude<TStepTplName, 'wallets'>>;
    depositPromoCodeParams?: IDepositPromoCodeCParams;
    stepsParams?: {
        /**
         * Media query, which describes when use steps template.
         */
        breakpoint: string;
        paymentListParams?: IPaymentListCParams;
        cryptoListParams?: IPaymentListCParams;
        bonusesListParams?: IDepositBonusesCParams;
        paymentFormParams?: IPaymentFormCParams;
    }
}

export const defaultParams: IDepositWithdrawCParams = {
    moduleName: 'finances',
    componentName: 'wlc-deposit-withdraw',
    mode: 'deposit',
    class: 'wlc-cash',
    showPaymentRules: true,
    stepsOrder: ['systems', 'cryptoInvoiceSystems', 'bonuses', 'paymentInfo'],
};

export interface IAdditionalFields {
    type: 'input' | 'select',
    params: IInputCParams | ISelectCParams,
}

export type FieldType = IInputCParams | IButtonCParams | ICheckboxCParams;

export type TMobileStep = 1 | 2 | 3;

export {depositForm, depositFormCrypto, withdrawForm} from 'wlc-engine/modules/finances/system/config';

export interface IPaymentStep {
    template: TStepTplName;
    title: string;
    ready?: Promise<void>;
    $resolve?: () => void;
}

export namespace PaymentSteps {

    export const wallet: IPaymentStep = {
        template: 'wallets',
        title: gettext('Select a wallet'),
    };

    export const bonus: IPaymentStep = {
        template: 'bonuses',
        title: gettext('Select a bonus'),
    };

    export const paymentSystem: IPaymentStep = {
        template: 'systems',
        title: gettext('Select a payment method'),
    };

    export const paymentInfo: IPaymentStep = {
        template: 'paymentInfo',
        title: gettext('Payment information'),
    };

    export const cryptoInvoices: IPaymentStep = {
        template: 'cryptoInvoiceSystems',
        title: gettext('Select a cryptocurrency'),
    };
}

export const timerParams: ITimerCParams = { // move to payment-form
    theme: 'one-line',
    common: {
        noDays: true,
        noHours: true,
        text: gettext('Time remaining for deposit:'),
    },
    acronyms: {
        minutes: gettext('min'),
        seconds: gettext('sec'),
    },
    dividers: {
        units: ' ',
        text: ' ',
    },
    iconPath: '/wlc/icons/spinner-1.svg',
};

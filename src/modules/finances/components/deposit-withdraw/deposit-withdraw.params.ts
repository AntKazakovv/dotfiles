import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectCParams,
    ICheckboxCParams,
    ITimerCParams,
} from 'wlc-engine/modules/core';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.component';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDepositWithdrawCParams extends IComponentParams<Theme, Type, ThemeMod> {
    mode: TPaymentsMethods;
    /** show/hide payment rules checkbox */
    showPaymentRules?: boolean;
    common?: {
        themeMod?: ThemeMod;
    };
    /** Params for timer element */
    timerParams?: ITimerCParams;
}

export const defaultParams: IDepositWithdrawCParams = {
    moduleName: 'finances',
    componentName: 'wlc-deposit-withdraw',
    mode: 'deposit',
    class: 'wlc-cash',
    showPaymentRules: true,
};

export interface IAdditionalFields {
    type: 'input' | 'select',
    params: IInputCParams | ISelectCParams,
}

export type FieldType = IInputCParams | IButtonCParams | ICheckboxCParams;

export {depositForm, depositFormCrypto, withdrawForm} from 'wlc-engine/modules/finances/system/config';

export interface IPaymentStep {
    template: string;
    title: string;
}

export namespace PaymentSteps {

    export const wallet: IPaymentStep = {
        template: 'wallets',
        title: gettext('Choose a wallet'),
    };

    export const bonus: IPaymentStep = {
        template: 'bonuses',
        title: gettext('Choose bonus'),
    };

    export const paymentSystem: IPaymentStep = {
        template: 'systems',
        title: gettext('Choose payment method'),
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

export const timerParams: ITimerCParams = {
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

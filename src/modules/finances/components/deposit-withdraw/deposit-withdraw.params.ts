import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectCParams,
    ICheckboxCParams,
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
    /** reset amount in form when Payment changed */
    resetAmountForm?: boolean;
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: IDepositWithdrawCParams = {
    moduleName: 'finances',
    componentName: 'wlc-deposit-withdraw',
    mode: 'deposit',
    class: 'wlc-cash',
    showPaymentRules: true,
    resetAmountForm: true,
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
}

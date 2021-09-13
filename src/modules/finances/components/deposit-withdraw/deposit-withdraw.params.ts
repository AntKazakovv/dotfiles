import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectCParams,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';
import {IButtonCParams} from 'wlc-engine/modules/core/components/button/button.component';


export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDepositWithdrawCParams extends IComponentParams<Theme, Type, ThemeMod> {
    mode: 'deposit' | 'withdraw';
    /** show/hide payment rules checkbox */
    showPaymentRules?: boolean;
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
};

export interface IAdditionalFields {
    type: 'input' | 'select',
    params: IInputCParams | ISelectCParams,
}

export type FieldType = IInputCParams | IButtonCParams | ICheckboxCParams;

export {depositForm, depositFormCrypto, withdrawForm} from 'wlc-engine/modules/finances/system/config';

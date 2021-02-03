import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDepositWithdrawCParams extends IComponentParams<Theme, Type, ThemeMod> {
    mode: 'deposit' | 'withdraw';
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: IDepositWithdrawCParams = {
    mode: 'deposit',
    class: 'wlc-cash',
};

export interface IAdditionalFields {
    type: 'input' | 'select',
    params: IInputCParams | ISelectCParams,
}

export {depositForm, withdrawFrom} from 'wlc-engine/modules/finances/system/config';

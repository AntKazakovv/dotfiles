import {
    IComponentParams,
    CustomType,
    IInputCParams,
    ISelectParams,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IDepositWithdrawParams extends IComponentParams<Theme, Type, ThemeMod> {
    mode: 'deposit' | 'withdraw';
    common?: {
        themeMod?: ThemeMod;
    };
}

export const defaultParams: IDepositWithdrawParams = {
    mode: 'deposit',
    class: 'wlc-cash',
};

export interface IAdditionalFields {
    type: 'input' | 'select',
    params: IInputCParams | ISelectParams,
}

export {depositForm, withdrawFrom} from 'wlc-engine/modules/finances/system/config';

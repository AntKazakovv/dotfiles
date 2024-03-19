import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {
    ThemeMod as TDepositWithdrawСThemeMod,
} from 'wlc-engine/modules/finances/components/deposit-withdraw/deposit-withdraw.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = TDepositWithdrawСThemeMod;

export interface IWithdrawInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IWithdrawInfoCParams = {
    class: 'wlc-withdraw-info',
    componentName: 'wlc-withdraw-info',
    moduleName: 'finances',
};

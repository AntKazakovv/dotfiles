import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IWithdrawCancelWidgetCParams 
    extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        transactionDateFormat: string;
    }

export const defaultParams: IWithdrawCancelWidgetCParams = {
    moduleName: 'finances',
    componentName: 'wlc-withdraw-cancel',
    class: 'wlc-withdraw-cancel',
    transactionDateFormat: 'DD/MM/YY HH:mm:ss',
};

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IPreselectedAmountsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    amounts: number[];
    currency: string;
}

export const defaultParams: IPreselectedAmountsCParams = {
    moduleName: 'finances',
    componentName: 'wlc-preselected-amounts',
    class: 'wlc-preselected-amounts',
    amounts: [],
    currency: '',
};

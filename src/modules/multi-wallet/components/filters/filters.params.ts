import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {ICurrencyFilter} from 'wlc-engine/modules/multi-wallet';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IFiltersParams extends IComponentParams<Theme, Type, ThemeMod> {
    descriptionText?: string;
    currencies?: ICurrencyFilter[];
}

export const defaultParams: IFiltersParams = {
    class: 'wlc-filters',
    moduleName: 'multi-wallet',
    componentName: 'wlc-filters',
    currencies: [],
    descriptionText: gettext('Select wallets to display'),
};

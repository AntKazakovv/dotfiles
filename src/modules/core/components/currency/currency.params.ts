import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ThemeType = 'default' | CustomType;
export type ThemeModType = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export type IndicatorFormatType = 'code' | 'symbol' | 'narrowSymbol' | 'name';

export interface ICurrencyParams extends IComponentParams<ThemeType, ComponentType, ThemeModType>{
    defaultCurrency?: string;
    defaultDigitsInfo?: string;
    defaultIndicator?: IndicatorFormatType;
    defaultLocale?: string;
}

export const defaultParams: ICurrencyParams = {
    class: 'wlc-currency',
    componentName: 'wlc-currency',
    moduleName: 'core',
    defaultCurrency: 'EUR',
    defaultIndicator: 'symbol',
    defaultDigitsInfo: '1-2-2',
};

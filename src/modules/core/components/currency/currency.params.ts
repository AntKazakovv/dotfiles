import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ThemeType = 'default' | CustomType;
export type ThemeModType = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export type IndicatorFormatType = 'code' | 'symbol' | 'narrowSymbol' | 'name';

export interface ICurrencyCParams extends IComponentParams<ThemeType, ComponentType, ThemeModType>{
    value?: number | string;
    currency?: string;
    digitsInfo?: string;
    indicatorFormat?: IndicatorFormatType;
}

export const defaultParams: ICurrencyCParams = {
    class: 'wlc-currency',
    componentName: 'wlc-currency',
    moduleName: 'core',
    value: 0,
    currency: 'EUR',
    indicatorFormat: 'symbol',
    digitsInfo: '1-2-2',
};

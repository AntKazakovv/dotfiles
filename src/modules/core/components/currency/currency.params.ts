import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ThemeType = 'default' | CustomType;
export type ThemeModType = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface ICurrencyCParams extends IComponentParams<ThemeType, ComponentType, ThemeModType>{
    value?: number | string;
    currency?: string;
    digitsInfo?: string;
    showIconOnly?: boolean;
}

export const defaultParams: ICurrencyCParams = {
    class: 'wlc-currency',
    componentName: 'wlc-currency',
    moduleName: 'core',
    value: 0,
    digitsInfo: '1-2-2',
    showIconOnly: false,
    currency: 'EUR',
};

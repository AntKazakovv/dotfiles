import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IAmountLimitCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    minValue?: number,
    maxValue?: number,
    showLimits?: boolean | ILimits
}

export interface ILimits {
    min: number,
    max: number,
}

export const defaultParams: IAmountLimitCParams = {
    moduleName: 'core',
    class: 'wlc-amount-limit',
    componentName: 'wlc-amount-limit',
    minValue: 10,
    maxValue: 10000,
};

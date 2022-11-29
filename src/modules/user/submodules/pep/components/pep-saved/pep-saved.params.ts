import {
    CustomType,
    IComponentParams,
    IFormWrapperCParams,
    PepStatusValuableOnly,
} from 'wlc-engine/modules/core';

type ComponentTheme = 'default' | CustomType;

type ComponentType = 'default' | CustomType;

type Theme = 'default' | CustomType;

type AutoModifiers = Theme | 'default';

type CustomMod = string;

type Modifiers = AutoModifiers | CustomMod | null;

export interface IPepSavedCParams extends IComponentParams<ComponentTheme, ComponentType, Modifiers> {
    pep: PepStatusValuableOnly;
    config?: IFormWrapperCParams;
}

export const defaultParams: Partial<IPepSavedCParams> = {
    wlcElement: 'wlc-pep-saved',
    class: 'wlc-pep-saved',
    moduleName: 'pep',
};

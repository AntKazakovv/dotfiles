import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;
export type DescriptionType = 'link' | 'action';

export interface IPromoStepsCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
};

export const defaultParams: IPromoStepsCParams = {
    class: 'wlc-promo-steps',
};

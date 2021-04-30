import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;

export interface IIconExpLpDescriptionCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
}

export const defaultParams: IIconExpLpDescriptionCParams = {
    class: 'wlc-icon-exp-lp',
};

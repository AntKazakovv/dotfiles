import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IInstructionCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
}

export const defaultParams: IInstructionCParams = {
    class: 'wlc-instruction',
    moduleName: 'static',
    componentName: 'wlc-instruction',
};

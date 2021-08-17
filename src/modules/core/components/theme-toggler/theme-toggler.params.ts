import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IThemeTogglerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {

};

export const defaultParams: IThemeTogglerCParams = {
    class: 'wlc-theme-toggler',
    componentName: 'wlc-theme-toggler',
    moduleName: 'core',
};

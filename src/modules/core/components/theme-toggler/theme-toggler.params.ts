import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | 'long' | 'alternative' | CustomType;
export type ComponentType = 'default' | 'inverse' | CustomType;
export type ComponentThemeMod = 'default' | 'vertical' | 'compact' | 'wolf' | CustomType;

export interface IThemeTogglerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Used in tooltip and in long theme of component. `Color theme` by default.
     */
    title?: string;
    darkTitle?: string;
    lightTitle?: string;
    /**
     * Mod for fixed left burger-panel
     */
    compactMod?: boolean;
};

export const defaultParams: IThemeTogglerCParams = {
    class: 'wlc-theme-toggler',
    componentName: 'wlc-theme-toggler',
    moduleName: 'core',
    title: gettext('Color theme'),
    darkTitle: gettext('Dark'),
    lightTitle: gettext('Light'),
    compactMod: false,
};

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IDepWagerCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    tooltipText?: string;
};

export const defaultParams: IDepWagerCParams = {
    class: 'wlc-dep-wager',
    componentName: 'wlc-dep-wager',
    moduleName: 'finances',
    tooltipText:
        gettext('The withdrawal will be available when the last deposit wagering coefficient reaches {{wager}}'),
};

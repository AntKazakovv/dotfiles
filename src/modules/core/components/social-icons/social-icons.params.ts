import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | 'wolf';
export type ComponentType = 'default';
export type ComponentThemeMod = 'default' | 'colored' | CustomType;

export type IconsType = 'default' | 'color';

export interface ISocialItem {
    name: string,
    link: string,
    order?: number,
}

export interface ISocialIconsCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    socials: ISocialItem[],
    iconPath: string,
    iconsType: IconsType,
}

export const defaultParams: ISocialIconsCParams = {
    class: 'wlc-social-icons',
    componentName: 'wlc-social-icons',
    moduleName: 'core',
    iconPath: '/wlc/icons/social/mono/',
    iconsType: 'default',
    socials: [],
};

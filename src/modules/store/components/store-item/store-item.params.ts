import {
    GlobalHelper,
    IComponentParams,
    CustomType,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | 'first' | 'wolf' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'chip-v2' | CustomType;
export type AutoModifiers = ComponentTheme | ComponentThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TIconExtension = 'svg' | 'png' | 'jpg';

export interface IStoreItemCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ComponentThemeMod;
        customModifiers?: CustomMod;
        defaultPicPath: string;
        defaultPicPathFirst: string;
        /** allows to use svg/png/jpg extension */
        iconFormat: TIconExtension;
    };
    buyBtnParams: IButtonCParams;
    buyBtnParamsWolf: IButtonCParams;
}

export const defaultParams: IStoreItemCParams = {
    moduleName: 'store',
    componentName: 'wlc-store-item',
    class: 'wlc-store-item',
    common: {
        defaultPicPath: GlobalHelper.gstaticUrl + '/store/default.png',
        defaultPicPathFirst: GlobalHelper.gstaticUrl + '/store/default1.png',
        iconFormat: 'svg',
    },
    buyBtnParams: {
        common: {
            text: gettext('Buy now'),
            typeAttr: 'button',
        },
        wlcElement: 'button_buy',
    },
    buyBtnParamsWolf: {
        common: {
            text: gettext('Buy now'),
            typeAttr: 'button',
            size: 'md',
        },
        wlcElement: 'button_buy',
    },
};

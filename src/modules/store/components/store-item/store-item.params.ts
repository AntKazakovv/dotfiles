import {
    GlobalHelper,
    IComponentWithPendingBtns,
} from 'wlc-engine/modules/core';
import {
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'first' | CustomType;
export type ThemeMod = 'default' | 'chip-v2' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TIconExtension = 'svg' | 'png' | 'jpg';

export interface IStoreItemCParams extends IComponentWithPendingBtns<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        customModifiers?: CustomMod;
        defaultPicPath: string;
        defaultPicPathFirst: string;
        /** allows to use svg/png/jpg extension */
        iconFormat: TIconExtension;
    };
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
    btnsParams: {
        buyBtnParams: {
            common: {
                text: gettext('Buy now'),
                typeAttr: 'button',
            },
            wlcElement: 'button_buy',
        },
    },
};

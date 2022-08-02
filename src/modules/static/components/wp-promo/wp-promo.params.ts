import {
    IComponentParams,
    CustomType,
    ITitleCParams,
    IModalConfig,
    IButtonCParams,
} from 'wlc-engine/modules/core';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'banner' | CustomType;

export interface IWpPromoCParams extends IComponentParams<Theme, Type, ThemeMod> {
    themeMod?: ThemeMod;
    /**
     * by this value from wp by category will come the values
     */
    categorySlug?: string;
    /**
     * settings for modal which opens to read full description item
     * @param modalSettings {IModalConfig}
     */
    modalSettings?: IModalConfig,
    /**
     * settings for first button
     * @param redirectButton {IButtonCParams}
     */
    redirectButton?: IButtonCParams,
    /**
     * settings for button which opens full description item
     * @param modalButton {IButtonCParams}
     */
    modalButton?: IButtonCParams,
    /**
     * settings for title component
     * @param titleComponentParams {ITitleCParams}
     */
    titleComponentParams?: ITitleCParams,
}

export const defaultParams: IWpPromoCParams = {
    themeMod: 'default',
    moduleName: 'static',
    componentName: 'wlc-wp-promo',
    class: 'wlc-wp-promo',
    categorySlug: 'promotion_posts',
    redirectButton: {
        common: {
            typeAttr: 'button',
        },
    },
    modalButton: {
        themeMod: 'secondary',
        common: {
            text: gettext('Read more'),
            typeAttr: 'button',
        },
    },
    modalSettings: {
        id: 'wp-promo-content',
        modifier: 'info',
        dismissAll: false,
        size: 'lg',
    },
    titleComponentParams: {
        mainText: gettext('Promotions'),
        customMod: 'promotions',
    },
};

import {
    IComponentParams,
    CustomType,
    IPaysystem,
} from 'wlc-engine/modules/core';
import {ColorIconBgType} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {MerchantModel} from 'wlc-engine/modules/games';

/** Available component themes */
export type ComponentTheme = 'merchants' | 'payments' | CustomType;
/**
 * Available component types, use it for merchants and payments
 *
 * If `default` - the component display color svg images using img tag.
 * If `svg` - the component display black (monochrome) svg images using svg tag.
 **/
export type ComponentType = 'default' | 'svg';
/** Available component theme modifiers */
export type ComponentThemeMod = 'default' | CustomType;
/** Available default types list icon */
export type ListTypes = {
    payment: IPaysystem[],
    merchant: MerchantModel[],
}
/**
 * Component params
 */
export interface IIconListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Defines theme of component */
    theme: ComponentTheme;
    /**
     * Array of items [IIconParams]{@link IconModel}
     *
     * Requires if `custom` theme is used.
     */
    items?: IIconParams[];
    /** Placeholder for error images */
    imgPlaceholder?: string;
    /** If true - scroll overflow icons in row */
    watchForScroll?: boolean;
    /** Common component parametrs */
    common?: {
        merchant?: {
            include?: string[],
            exclude?: string[],
        }
        /**
         * Payments list customization by paysystem names.
         *
         * `Name` must match the name of paysystem in fundist.
         * */
        payment?: {
            /** List of paysystem names to be included. */
            include?: string[],
            /** List of paysystems to be excluded. If `all` - all default paysystems are excluded. */
            exclude?: string[],
        },
    }
    /** Apply one of two types of colored icons (works only with colored) */
    colorIconBg?: ColorIconBgType;
    /** `false` - by default, show alt of image instead of image. If `true` - block with image will be hidden */
    hideImgOnError?: boolean;
}

/**
 * Default component params
 */
export const defaultParams: IIconListCParams = {
    class: 'wlc-icon-list',
    componentName: 'wlc-icon-list',
    moduleName: 'core',
    theme: 'merchants',
    imgPlaceholder: '/static/images/placeholder.png',
};

import {
    CustomType,
    IPaysystem,
} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

/** Available component themes */
export type ComponentTheme = 'merchants' | 'payments' | 'safety' | CustomType;
/**
 * Available component types, use it for merchants and payments
 *
 * If `default` - the component display color svg images using img tag.
 * If `svg` - the component display black (monochrome) svg images using svg tag.
 **/
export type ComponentType = 'default' | 'svg';
/** Available component theme modifiers */
export type ComponentThemeMod = 'default' | CustomType;

/**
 * Component params
 */
export interface IIconListCParams extends IAbstractIconsListParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /** Defines theme of component */
    theme: ComponentTheme;
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
    }
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

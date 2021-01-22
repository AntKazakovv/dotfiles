import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

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
    /** Common component parametrs */
    common?: {
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
}

/**
 * Default component params
 */
export const defaultParams: IIconListCParams = {
    class: 'wlc-icon-list',
    theme: 'merchants',
    imgPlaceholder: '/static/images/placeholder.png',
};

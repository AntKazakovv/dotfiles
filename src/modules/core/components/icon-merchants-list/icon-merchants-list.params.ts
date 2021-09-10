import {
    CustomType,
    IIconListCParams,
} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IIconMerchantsListCParams extends
IAbstractIconsListParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Params for iconListComponent
     *
     * @example
     * iconComponentParams: {
     *     theme: 'merchants',
     *     type: 'svg',
     *     wlcElement: 'block_merchants',
     *     hideImgOnError: true,
     * }
     */
    iconComponentParams: IIconListCParams;
    /**
     * Array for include merchant array
     *
     * @example
     * include: ['tomhorn','netent']
     */
    include?: string[];
    /**
     * Array for exclude merchant array
     *
     * @example
     * exclude: ['all'] - disable all icons
     * */
    exclude?: string[];
}

export const defaultParams: IIconMerchantsListCParams = {
    class: 'wlc-icon-merchants-list',
    componentName: 'wlc-icon-merchants-list',
    moduleName: 'core',
    iconsType: 'black',
    iconComponentParams: {
        theme: 'merchants',
        wlcElement: 'block_merchants',
        hideImgOnError: true,
    },
};

import {
    CustomType,
    IComponentParams,
    IIconListCParams,
} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IIconMerchantsListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
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
    iconComponentParams: {
        theme: 'merchants',
        type: 'svg',
        wlcElement: 'block_merchants',
        hideImgOnError: true,
    },
};

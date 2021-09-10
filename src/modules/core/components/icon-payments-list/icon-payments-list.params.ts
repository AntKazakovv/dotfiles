import {
    CustomType,
    IIconListCParams,
} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IIconPaymentsListCParams extends
IAbstractIconsListParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Params for iconListComponent
     *
     * @example
     * iconComponentParams: {
     *     theme: 'merchants',
     *     wlcElement: 'block_merchants',
     *     hideImgOnError: true,
     * }
     */
    iconComponentParams: IIconListCParams;
    /**
     * Array for include paysystems array
     *
     * @example
     * include: ['paycryptos_ethereum']
     */
    include?: string[];
    /**
     * Array for exclude paysystems array
     *
     * @example
     * exclude: ['all'] - disable all icons
     * */
    exclude?: string[];
}

export const defaultParams: IIconPaymentsListCParams = {
    class: 'wlc-icon-payments-list',
    componentName: 'wlc-icon-payments-list',
    moduleName: 'core',
    colorIconBg: 'dark',
    iconsType: 'color',
    iconComponentParams: {
        theme: 'payments',
        watchForScroll: true,
        wlcElement: 'block_payments',
        hideImgOnError: true,
    },
};

import {
    CustomType,
    IComponentParams,
    IIconListCParams,
} from 'wlc-engine/modules/core';
import {IIconParams} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IIconPaymentsListCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
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
    /**
     * Array for custom icons
     *
     * @example
     * items: [
     *      {
     *          showAs: 'img',
     *          iconUrl: '/static/images/payments/MCSecureCode.svg',
     *      },
     *      {
     *          showAs: 'img',
     *          iconUrl: '/static/images/payments/VerifiedByVisa .svg',
     *      },
     * ]
     */
    items?: IIconParams[];
}

export const defaultParams: IIconPaymentsListCParams = {
    class: 'wlc-icon-payments-list',
    componentName: 'wlc-icon-payments-list',
    moduleName: 'core',
    iconComponentParams: {
        theme: 'payments',
        watchForScroll: true,
        wlcElement: 'block_payments',
        colorIconBg: 'dark',
        hideImgOnError: true,
    },
};

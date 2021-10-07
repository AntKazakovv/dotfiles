import {
    CustomType,
    IIconListCParams,
} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IIconSafetyListCParams extends
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
}

export const defaultParams: IIconSafetyListCParams = {
    class: 'wlc-icon-safety-list',
    componentName: 'wlc-icon-safety-list',
    moduleName: 'core',
    colorIconBg: 'dark',
    iconsType: 'color',
    iconComponentParams: {
        theme: 'safety',
        watchForScroll: true,
        wlcElement: 'block_safety',
        hideImgOnError: true,
    },
    items: [
        {
            iconUrl: '/gstatic/safety-icons/ssl.jpeg',
            alt: 'SSL Encryption',
        },
        {
            iconUrl: '/gstatic/safety-icons/gamcare.png',
            alt: 'GAMCARE',
        },
        {
            iconUrl: '/gstatic/safety-icons/gambling_therapy.png',
            alt: 'Gambling Therapy',
        },
    ],
};

import {SwiperOptions} from 'swiper';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {ColorIconBgType} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'slider' | CustomType;
export type ComponentThemeMod = 'default' | 'inside-modal' | CustomType;

/**
 * Globally set preferences in modules config
 * @example
 * const $modules = {
 *  games: {
 *      components: {
 *          'wlc-provider-links': {
 *              iconType: 'color',
 *          }
 *      }
 *  }
 * }
 */
export interface IProviderLinksCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    sliderParams?: SwiperOptions;
    iconsType?: 'color' | 'black';
    /** Apply one of two types of colored icons (works only with colored) */
    colorIconBg?: ColorIconBgType;
};

export const defaultParams: IProviderLinksCParams = {
    class: 'wlc-provider-links',
    componentName: 'wlc-provider-links',
    moduleName: 'games',
    iconsType: 'black',
    type: 'slider',
    sliderParams: {
        spaceBetween: 15,
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: true,
        navigation: {
            prevEl: '.wlc-provider-links .wlc-swiper-button-prev',
            nextEl: '.wlc-provider-links .wlc-swiper-button-next',
        },
        breakpoints: {
            300: {
                spaceBetween: 10,
                slidesPerView: 2,
                slidesPerGroup: 1,
            },
            560: {
                spaceBetween: 10,
                slidesPerView: 3,
                slidesPerGroup: 1,
            },
            720: {
                spaceBetween: 15,
                slidesPerView: 4,
                slidesPerGroup: 4,
            },
            1024: {
                spaceBetween: 15,
                slidesPerView: 5,
                slidesPerGroup: 5,
            },
            1366: {
                spaceBetween: 15,
                slidesPerView: 6,
                slidesPerGroup: 6,
            },
            1630: {
                spaceBetween: 15,
                slidesPerView: 7,
                slidesPerGroup: 7,
            },
        },
    },
};

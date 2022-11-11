import {CustomType} from 'wlc-engine/modules/core';
import {IAbstractIconsListParams} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {ISliderCParams} from 'wlc-engine/modules/promo';

export type ComponentTheme = 'default' | 'mobile-app' | 'mobile-app-swiper' | CustomType;
export type ComponentType = 'default' | 'slider' | 'mobile' | 'mobile-app' | CustomType;
export type ComponentThemeMod = 'default' | 'inside-modal' | 'adaptive' | CustomType;

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
export interface IProviderLinksCParams extends
IAbstractIconsListParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    linkText?: string;
    sliderParams?: ISliderCParams;
    defaultLinkSref?: string;
};

export const defaultParams: IProviderLinksCParams = {
    class: 'wlc-provider-links',
    componentName: 'wlc-provider-links',
    moduleName: 'games',
    iconsType: 'black',
    type: 'slider',
    linkText: 'See all',
    defaultLinkSref: 'app.providers',
    sliderParams: {
        swiper: {
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
                    followFinger: false,
                },
                560: {
                    spaceBetween: 10,
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    followFinger: false,
                },
                720: {
                    spaceBetween: 15,
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    followFinger: false,
                },
                1024: {
                    spaceBetween: 15,
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    followFinger: true,
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
    },
};

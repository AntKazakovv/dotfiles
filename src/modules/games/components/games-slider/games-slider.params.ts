import Swiper from 'swiper';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {ISliderCParams} from 'wlc-engine/modules/promo';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IGamesSliderCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Minimal amount of milliseconds for slider rotation
     */
    minTimer?: number;
    /**
     * Maximal amount of milliseconds for slider rotation
     */
    maxTimer?: number;
    /**
     * Minimal amount of slides
     * Use only odd values
     * Recommended value - 11
     */
    minAmount?: number;
    /**
     * Maximal amount of slides
     * Use only odd values
     */
    maxAmount?: number;
    /**
     * Sets the filter which returns games list according to filter object.
     * If no one filter is defined, or `filter` is empty, games list contains all the games.
     */
    filter?: IGamesFilterData;
    /**
     * If true, modal is open
     */
    isModal?: boolean;
    /**
     * Slider params
     */
    sliderParams?: ISliderCParams;
    /**
     * Title for desktop
     */
    title?: string;
    /**
     * Title for mobile
     */
    titleMobile?: string;
    /**
     * Subitle for all device types
     */
    subtitle?: string;
    /**
     * Text for button that turns on swiper
     */
    buttonText?: string;
    /**
     * Text for error template
     */
    errorText?: string;
    iconUrl?: string;
};

export const defaultParams: IGamesSliderCParams = {
    class: 'wlc-games-slider',
    moduleName: 'games',
    componentName: 'wlc-games-slider',
    minTimer: 1500,
    maxTimer: 4000,
    minAmount: 11,
    maxAmount: 11,
    /**
     * Highly recommended not to change category because slots always contain enough games for slider
     */
    filter: {
        categories: ['slots'],
    },
    isModal: false,
    title: gettext('Need help picking a game?'),
    titleMobile: gettext('Feeling lucky?'),
    subtitle: gettext('Try to play a random game'),
    buttonText: gettext('Find a game'),
    errorText: gettext('No games available'),
    sliderParams: {
        swiper: {
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 70,
                depth: 50,
                modifier: 1,
                slideShadows: true,
                transformEl: '.wlc-game-thumb',
            },
            slidesPerView: 2,
            centeredSlides: true,
            loopedSlides: 11,
            loop: true,
            pagination: false,
            preventClicks: true,
            preloadImages: false,
            lazy: true,
            autoplay: {
                delay: 0,
            },
            on: {
                afterInit: (swiper: Swiper): void => {
                    swiper.autoplay.stop();
                },
            },
            speed: 20,
            swipeHandler: '.no-swipe',
            breakpoints: {
                375: {
                    coverflowEffect: {
                        stretch: 115,
                    },
                    followFinger: false,
                },
                560: {
                    coverflowEffect: {
                        stretch: 175,
                    },
                    followFinger: false,
                },
                640: {
                    coverflowEffect: {
                        stretch: 204,
                    },
                    followFinger: false,
                },
                720: {
                    coverflowEffect: {
                        stretch: 132,
                    },
                    slidesPerView: 3,
                    followFinger: false,
                },
                768: {
                    coverflowEffect: {
                        stretch: 135,
                    },
                    slidesPerView: 3,
                    followFinger: false,
                },
                900: {
                    coverflowEffect: {
                        stretch: 162,
                    },
                    slidesPerView: 3,
                    followFinger: false,
                },
                1024: {
                    coverflowEffect: {
                        stretch: 145,
                    },
                    slidesPerView: 3,
                    followFinger: true,
                },
                1200: {
                    coverflowEffect: {
                        stretch: 122,
                    },
                    slidesPerView: 4,
                },
                1630: {
                    coverflowEffect: {
                        stretch: 166,
                    },
                    slidesPerView: 4,
                },

            },
        },
    },
    iconUrl: '/gstatic/images/games-slider.png',
};

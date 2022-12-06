import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import {IProviderLinksCParams} from 'wlc-engine/modules/games/components/provider-links/provider-links.params';

export namespace providers {

    export const slider: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                params: <IProviderLinksCParams>{
                    theme: 'mobile-app-swiper',
                    iconsType: 'color',
                    colorIconBg: 'dark',
                    linkText: 'All',
                    defaultLinkSref: 'app.providers.item',
                    sliderParams: {
                        slideShowAll: {
                            use: true,
                            sref: 'app.providers',
                        },
                        swiper: {
                            spaceBetween: 10,
                            slidesPerView: 2.5,
                            slidesPerGroup: 2,
                            loop: false,
                            navigation: {
                                prevEl: '.wlc-provider-links .wlc-swiper-button-prev',
                                nextEl: '.wlc-provider-links .wlc-swiper-button-next',
                            },
                        },
                    },
                },
            },
        ],
    };

    export const list: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-links',
                params: {
                    theme: 'mobile-app',
                    type: 'mobile-app',
                    iconsType: 'color',
                    colorIconBg: 'dark',
                    defaultLinkSref: 'app.providers.item',
                },
            },
        ],
    };

    export const gamesSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: {
                    theme: 'mobile-app',
                    type: 'mobile-app',
                    iconType: 'color',
                    colorIconBg: 'dark',
                    gamesGridCategoryParams: {
                        type: 'swiper',
                        theme: 'mobile-app-swiper',
                        showTitle: true,
                        showAllLink: {
                            use: true,
                            text: 'All',
                            sref: 'app.providers.item.category',
                        },
                        showAsSwiper: {
                            maxSlidesCount: 20,
                            sliderParams: {
                                slideShowAll: {
                                    use: true,
                                    sref: 'app.providers.item.category',
                                },
                                swiper: {
                                    slidesPerView: 2.5,
                                    slidesPerGroup: 2,
                                    grid: null,
                                    spaceBetween: 10,
                                    loop: false,
                                    breakpoints: {
                                        375: {
                                            slidesPerView: 2.5,
                                            slidesPerGroup: 2,
                                            grid: {
                                                rows: 1,
                                                fill: 'row',
                                            },
                                            spaceBetween: 10,
                                            followFinger: false,
                                        },
                                        560: {
                                            slidesPerView: 3.5,
                                            slidesPerGroup: 3,
                                            grid: null,
                                            spaceBetween: 10,
                                            followFinger: false,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ],
    };

    export const gamesGrid: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'games.wlc-provider-games',
                params: {
                    theme: 'mobile-app',
                    type: 'mobile-app',
                    iconType: 'color',
                    colorIconBg: 'dark',
                    gamesGridCategoryParams: {
                        theme: 'default',
                        themeMod: 'mobile-app',
                        gamesRows: 6,
                        showTitle: true,
                        showAllLink: {
                            use: false,
                        },
                        moreBtn: {
                            hide: false,
                            lazy: true,
                        },
                        thumbParams: {
                            theme: 'default',
                        },
                    },
                },
            },
        ],
    };
}

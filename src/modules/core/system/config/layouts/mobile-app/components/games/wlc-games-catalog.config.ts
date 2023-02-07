import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcGamesCatalog {

    export const def: ILayoutComponent = {
        name: 'games.wlc-games-catalog',
        params: {
            gamesGridParams: {
                themeMod: 'mobile-app',
                gamesRows: 6,
                showTitle: false,
                showAllLink: {
                    use: false,
                },
                moreBtn: {
                    hide: false,
                    lazy: true,
                },
            },
        },
    };

    export const categoryGamesSwipers: ILayoutComponent = {
        name: 'games.wlc-games-catalog',
        params: {
            showAllCategories: true,
            gamesGridParams: {
                type: 'swiper',
                theme: 'mobile-app-swiper',
                filter: null,
                thumbParams: {
                    themeMod: 'mobile-app',
                },
                showAllLink: {
                    use: true,
                    text: 'All',
                    sref: 'app.catalog',
                },
                showAsSwiper: {
                    maxSlidesCount: 10,
                    sliderParams: {
                        useStartTimeout: true,
                        slideShowAll: {
                            use: true,
                            sref: 'app.catalog',
                            srefParams: {
                                category: null,
                            },
                        },
                        swiper: {
                            slidesPerView: 2.5,
                            slidesPerGroup: 2,
                            grid: null,
                            spaceBetween: 10,
                            loop: false,
                            breakpoints: {
                                300: {
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
    };
}

import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';

import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

export namespace wlcGamesGrid {

    export const categoryGamesSwiperParams: IGamesGridCParams = {
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
            maxSlidesCount: 20,
            sliderParams: {
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
    };

    export const popularGamesSwiper: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: _merge(_cloneDeep(categoryGamesSwiperParams), {
            title: gettext('Popular games'),
            filter: {
                categories: ['popular'],
            },
            showAllLink: {
                params: {
                    category: 'popular',
                },
            },
            showAsSwiper: {
                sliderParams: {
                    slideShowAll: {
                        srefParams: {
                            category: 'popular',
                        },
                    },
                },
            },
        }),
    };

    export const newGamesSwiper: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: _merge(_cloneDeep(categoryGamesSwiperParams), {
            title: gettext('New games'),
            filter: {
                categories: ['new'],
            },
            showAllLink: {
                params: {
                    category: 'new',
                },
            },
            showAsSwiper: {
                sliderParams: {
                    slideShowAll: {
                        srefParams: {
                            category: 'new',
                        },
                    },
                },
            },
        }),
    };

    export const allGamesSwiper: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: _merge(_cloneDeep(categoryGamesSwiperParams), {
            title: gettext('All games'),
            filter: {
                categories: ['casino'],
            },
            showAllLink: {
                params: {
                    category: 'casino',
                },
            },
            showAsSwiper: {
                sliderParams: {
                    slideShowAll: {
                        srefParams: {
                            category: 'casino',
                        },
                    },
                },
            },
        }),
    };

    export const allGames2rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 2,
            title: gettext('Popular games'),
            usePlaceholders: true,
            filter: {
                categories: ['popular'],
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                    moreBtn: {
                        hide: false,
                    },
                },
            },
        },
    };

    export const roullete1row: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 2,
            title: gettext('New games'),
            filter: {
                categories: ['new'],
            },
            usePlaceholders: true,
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
            moreBtn: {
                hide: true,
                lazy: false,
            },
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                    moreBtn: {
                        hide: false,
                    },
                },
            },
        },
    };

    export const allGames3rows: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 3,
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: false,
            },
            usePlaceholders: true,
            byState: true,
        },
    };

    export const catalogGamesWithLoadMoreBtn: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: false,
            },
            byState: true,
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                },
            },
        },
    };

    export const catalogGamesWithLazyLoad: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            title: gettext('All games'),
            filter: null,
            showAllLink: {
                use: false,
            },
            moreBtn: {
                hide: false,
                lazy: true,
            },
            byState: true,
            breakpoints: {
                'mobile': {
                    gamesRows: 3,
                },
            },
        },
    };

    export const vertical: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 1,
            title: gettext('Vertical games'),
            usePlaceholders: true,
            filter: {
                categories: ['vertical'],
            },
            thumbParams: {
                theme: 'vertical',
                type: 'vertical',
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog.child',
                params: {
                    category: 'casino',
                    childCategory: 'vertical',
                },
            },
        },
    };

    export const popularVertical: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 1,
            title: gettext('Popular games'),
            usePlaceholders: true,
            filter: {
                categories: ['vertical'],
            },
            thumbParams: {
                theme: 'vertical',
                type: 'vertical',
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
        },
    };

    export const popularGamesSwiperWithEars: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            type: 'swiper',
            theme: 'swiper',
            title: gettext('Popular games'),
            filter: {
                categories: ['popular'],
            },
            showAllLink: {
                use: true,
                position: 'bottom',
                showAsBtn: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
            breakpoints: {
                1024: {
                    showAllLink: {
                        position: 'top',
                        showAsBtn: false,
                    },
                },
            },
            showAsSwiper: {
                sliderParams: {
                    swiper: {
                        slidesPerView: 1.1,
                        grid: null,
                        spaceBetween: 10,
                        breakpoints: {
                            375: {
                                slidesPerView: 2.1,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            560: {
                                slidesPerView: 3.1,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            720: {
                                slidesPerView: 4.1,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            900: {
                                slidesPerView: 3.1,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            1024: {
                                slidesPerView: 4.1,
                                grid: null,
                                spaceBetween: 15,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 5.1,
                                grid: null,
                                spaceBetween: 15,
                            },
                            1630: {
                                slidesPerView: 6.1,
                                grid: null,
                                spaceBetween: 20,
                            },
                        },
                    },
                },
            },
        },
    };

    export const newGamesSwiperWithEars: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            type: 'swiper',
            theme: 'swiper',
            title: gettext('New games'),
            filter: {
                categories: ['new'],
            },
            showAllLink: {
                use: true,
                position: 'bottom',
                showAsBtn: true,
                sref: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
            breakpoints: {
                1024: {
                    showAllLink: {
                        position: 'top',
                        showAsBtn: false,
                    },
                },
            },
            showAsSwiper: {
                sliderParams: {
                    swiper: {
                        slidesPerView: 1.1,
                        grid: null,
                        spaceBetween: 10,
                        breakpoints: {
                            375: {
                                slidesPerView: 2.1,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            560: {
                                slidesPerView: 3.1,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            720: {
                                slidesPerView: 4.1,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            900: {
                                slidesPerView: 3.1,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            1024: {
                                slidesPerView: 4.1,
                                grid: null,
                                spaceBetween: 15,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 5.1,
                                grid: null,
                                spaceBetween: 15,
                            },
                            1630: {
                                slidesPerView: 6.1,
                                grid: null,
                                spaceBetween: 20,
                            },
                        },
                    },
                },
            },
        },
    };

    export const popularGamesPreview: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            theme: 'preview',
            gamesRows: 2,
            filter: {
                categories: ['popular'],
            },
            thumbParams: {
                theme: 'default',
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
        },
    };

    export const newGamesPreview: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            theme: 'preview',
            gamesRows: 2,
            filter: {
                categories: ['new'],
            },
            thumbParams: {
                theme: 'default',
            },
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
        },
    };
}

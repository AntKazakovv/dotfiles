import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';
import {IBannersSliderCParams} from 'wlc-engine/modules/promo';

export namespace wlcGamesGrid {
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

    export const popularGamesSwiper: ILayoutComponent = {
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
                375:{
                    showAsSwiper: {
                        maxSlidesCount: 24,
                    },
                },
                1024: {
                    maxSlidesCount: 20,
                    showAllLink: {
                        position: 'top',
                    },
                },
                1200: {
                    showAsSwiper: {
                        maxSlidesCount: 30,
                    },
                },
                1630: {
                    showAsSwiper: {
                        maxSlidesCount: 36,
                    },
                },
            },
            showAsSwiper: {
                useNavigation: true,
                sliderParams: {
                    swiper: {
                        preloadImages: false,
                        lazy: true,
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        grid: null,
                        spaceBetween: 10,
                        breakpoints: {
                            375: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            560: {
                                slidesPerView: 3,
                                slidesPerGroup: 2,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            720: {
                                slidesPerView: 4,
                                slidesPerGroup: 3,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            900: {
                                slidesPerView: 3,
                                slidesPerGroup: 2,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 3,
                                grid: null,
                                spaceBetween: 15,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 5,
                                slidesPerGroup: 4,
                                grid: null,
                                spaceBetween: 15,
                            },
                            1630: {
                                slidesPerView: 6,
                                slidesPerGroup: 5,
                                grid: null,
                                spaceBetween: 20,
                            },
                        },
                    },
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
                375:{
                    showAsSwiper: {
                        maxSlidesCount: 24,
                    },
                },
                1024: {
                    maxSlidesCount: 20,
                    showAllLink: {
                        position: 'top',
                        showAsBtn: false,
                    },
                },
                1200: {
                    showAsSwiper: {
                        maxSlidesCount: 30,
                    },
                },
                1630: {
                    showAsSwiper: {
                        maxSlidesCount: 36,
                    },
                },
            },
            showAsSwiper: {
                sliderParams: {
                    swiper: {
                        preloadImages: false,
                        lazy: true,
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

    export const newGamesSwiper: ILayoutComponent = {
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
                sref: 'app.catalog',
                showAsBtn: true,
                params: {
                    category: 'new',
                },
            },
            breakpoints: {
                375:{
                    showAsSwiper: {
                        maxSlidesCount: 24,
                    },
                },
                1024: {
                    maxSlidesCount: 20,
                    showAllLink: {
                        position: 'top',
                    },
                },
                1200: {
                    showAsSwiper: {
                        maxSlidesCount: 30,
                    },
                },
                1630: {
                    showAsSwiper: {
                        maxSlidesCount: 36,
                    },
                },
            },
            showAsSwiper: {
                useNavigation: true,
                sliderParams: {
                    swiper: {
                        preloadImages: false,
                        lazy: true,
                        slidesPerView: 1,
                        grid: null,
                        spaceBetween: 10,
                        breakpoints: {
                            375: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            560: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                                grid: {
                                    rows: 2,
                                    fill: 'row',
                                },
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            720: {
                                slidesPerView: 4,
                                slidesPerGroup: 3,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            900: {
                                slidesPerView: 3,
                                slidesPerGroup: 2,
                                grid: null,
                                spaceBetween: 10,
                                followFinger: false,
                            },
                            1024: {
                                slidesPerView: 4,
                                slidesPerGroup: 3,
                                grid: null,
                                spaceBetween: 15,
                                followFinger: true,
                            },
                            1200: {
                                slidesPerView: 5,
                                slidesPerGroup: 4,
                                grid: null,
                                spaceBetween: 15,
                            },
                            1630: {
                                slidesPerView: 6,
                                slidesPerGroup: 5,
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
                375:{
                    showAsSwiper: {
                        maxSlidesCount: 24,
                    },
                },
                1024: {
                    maxSlidesCount: 20,
                    showAllLink: {
                        position: 'top',
                        showAsBtn: false,
                    },
                },
                1200: {
                    showAsSwiper: {
                        maxSlidesCount: 30,
                    },
                },
                1630: {
                    showAsSwiper: {
                        maxSlidesCount: 36,
                    },
                },
            },
            showAsSwiper: {
                sliderParams: {
                    swiper: {
                        preloadImages: false,
                        lazy: true,
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

    export const popularGamesGridBanner: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            gamesRows: 2,
            breakpoints: {
                'mobile': {
                    gamesRows: 2,
                },
            },
            title: gettext('Popular games'),
            filter: {
                categories: ['popular'],
            },
            bannerSettings: <IBannersSliderCParams> {
                sliderParams: {
                    swiper: {
                        enabled: true,
                        spaceBetween: 20,
                        pagination: {
                            enable: true,
                            clickable: true,
                        },
                        autoplay: {
                            delay: 10000,
                        },
                        loop: true,
                    },
                },
                hideNavigation: true,
                params: {
                    theme: 'game-banner',
                },
                banner: {
                    theme: 'game-banner',
                },
                filter: {
                    position: ['games-grid-banner-popular'],
                },
            },
            usePlaceholders: true,
            byState: true,
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'new',
                },
            },
        },
    };

    export const newGamesGridBanner: ILayoutComponent = {
        name: 'games.wlc-games-grid',
        params: <IGamesGridCParams>{
            themeMod: 'banner-right',
            gamesRows: 2,
            breakpoints: {
                'mobile': {
                    gamesRows: 2,
                },
            },
            title: gettext('New games'),
            filter: {
                categories: ['new'],
            },
            bannerSettings: <IBannersSliderCParams> {
                sliderParams: {
                    swiper: {
                        enabled: true,
                        spaceBetween: 20,
                        pagination: {
                            enable: true,
                            clickable: true,
                        },
                        autoplay: {
                            delay: 10000,
                        },
                        loop: true,
                    },
                },
                hideNavigation: true,
                params: {
                    theme: 'game-banner',
                },
                banner: {
                    theme: 'game-banner',
                },
                filter: {
                    position: ['games-grid-banner-new'],
                },
            },
            usePlaceholders: true,
            byState: true,
            showAllLink: {
                use: true,
                sref: 'app.catalog',
                params: {
                    category: 'popular',
                },
            },
        },
    };
}

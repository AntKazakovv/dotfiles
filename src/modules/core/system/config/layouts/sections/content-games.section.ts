import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace contentGames {
    export const homeTop: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGames2rows,
        ],
    };

    export const homeTopSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.popularGamesSwiper,
        ],
    };

    export const homeTopSwiperWithEars: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.popularGamesSwiperWithEars,
        ],
    };

    export const homeWins: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-wins',
                    components: [
                        componentLib.wlcLastWinsSlider.def,
                        componentLib.wlcBiggestWinsSlider.def,
                    ],
                },
            },
        ],
    };

    export const homeWinsTransparent: ILayoutSectionConfig = {
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-wins',
                    components: [
                        componentLib.wlcLastWinsSlider.transparent,
                        componentLib.wlcBiggestWinsSlider.transparent,
                    ],
                },
            },
        ],
    };

    export const homeWinsTournament: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLastWinsSlider.alongWithTournament,
            componentLib.wlcTournamentBannersSlider.def,
        ],
        smartSection: {
            hostClasses: 'wlc-mb-xl',
            innerClasses: 'wlc-gap-sm wlc-gap-1420-md',
            columns: [
                'wlc-c-12 wlc-c-900-6 wlc-c-1200-5 wlc-c-1630-4',
                'wlc-c-12 wlc-c-900-6 wlc-c-1200-7 wlc-c-1630-8',
            ],
        },
    };

    export const randomGames: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesSlider.def,
        ],
    };

    export const homeWinsBonuses: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLastWinsSlider.def,
            componentLib.wlcBonusesList.promoHome,
            componentLib.wlcBiggestWinsSlider.def,
        ],
        smartSection: {
            hostClasses: 'wlc-mb-xl',
            innerClasses: 'wlc-gap-sm wlc-gap-1420-md',
            columns: [
                'wlc-c-12 wlc-c-768-6 wlc-c-1366-4',
                'wlc-c-12 wlc-c-768-12 wlc-c-900-6 wlc-c-1366-4 wlc-order-768-last wlc-order-1366-unset',
                'wlc-c-12 wlc-c-768-6 wlc-c-1366-4',
            ],
        },
    };

    export const homeBottom: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.roullete1row,
        ],
    };

    export const homeBottomSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.newGamesSwiper,
        ],
    };

    export const homeBottomSwiperWithEars: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.newGamesSwiperWithEars,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesCatalog.def,
        ],
    };

    export const catalogWolf: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesCatalog.wolf,
        ],
    };

    export const vertical: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.vertical,
        ],
    };

    export const popularVertical: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.popularVertical,
        ],
    };

    export const popularGamesGridBanner: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.popularGamesGridBanner,
        ],
    };

    export const newGamesGridBanner: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.newGamesGridBanner,
        ],
    };

    export const originalGames: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.originalGamesSwiper,
        ],
    };
}

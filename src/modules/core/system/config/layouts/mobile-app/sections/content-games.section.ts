import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace contentGames {
    export const homeTopSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.popularGamesSwiper,
        ],
    };

    export const newTopSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.newGamesSwiper,
        ],
    };

    export const allTopSwiper: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGamesSwiper,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesCatalog.def,
        ],
    };

    export const homeTop: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGames2rows,
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
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-wins wlc-home-wins--tournament',
                    components: [
                        componentLib.wlcLastWinsSlider.alongWithTournament,
                        componentLib.wlcTournamentBannersSlider.def,
                    ],
                },
            },
        ],
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
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-wins-bonuses',
                    components: [
                        componentLib.wlcLastWinsSlider.def,
                        componentLib.wlcBonusesList.promoHome,
                        componentLib.wlcBiggestWinsSlider.def,
                    ],
                },
            },
        ],
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
}

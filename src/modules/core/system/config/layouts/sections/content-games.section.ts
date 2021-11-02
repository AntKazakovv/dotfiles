import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace contentGames {
    export const homeTop: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.allGames2rows,
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
        theme: 'transparent',
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

    export const homeBottom: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.roullete1row,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesCatalog.def,
        ],
    };

    export const vertical: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGamesGrid.vertical,
        ],
    };
}

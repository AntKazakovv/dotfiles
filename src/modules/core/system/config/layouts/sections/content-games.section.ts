import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import {IWinnersSliderCParams} from 'wlc-engine/modules/promo';
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

import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace homePromo {
    export const wins: ILayoutSectionConfig = {
        theme: 'wins',
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-promo',
                    components: [
                        componentLib.wlcLastWinsSlider.alongWithTournament,
                        componentLib.wlcTournamentBannersSlider.def,
                    ],
                },
            },
        ],
    };

    export const bonuses: ILayoutSectionConfig = {
        theme: 'bonuses',
        container: true,
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-home-promo',
                    components: [
                        componentLib.wlcBonusesList.promoHome,
                        componentLib.wlcTournamentBannersSlider.def,
                    ],
                },
            },
        ],
    };
}

import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace homePromo {
    export const wins: ILayoutSectionConfig = {
        theme: 'wins',
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

    export const bonuses: ILayoutSectionConfig = {
        theme: 'bonuses',
        container: true,
        components: [
            componentLib.wlcBonusesList.promoHome,
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
}

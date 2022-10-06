import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace promoTournaments {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.tournaments,
            componentLib.wlcTournamentList.def,
        ],
    };
}

import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace totalJackpotSection {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcTitle.totalJackpot,
            componentLib.wlcTotalJackpot.home,
            componentLib.wlcButton.totalJackpot,
        ],
    };

    export const gamesInside: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcTotalJackpot.gamesInside,
        ],
    };

    export const gamesInsideModLabel: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcTotalJackpot.gamesInsideModLabel,
        ],
    };
}

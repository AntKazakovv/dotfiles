import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace promoBonuses {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBonusesList.promoHome,
            componentLib.wlcPlug.tournaments,
        ],
    };
}

import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace gameWidgets {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcGameThumb.promoWidget,
            componentLib.wlcSportsbook.betradarDailyMatch,
            componentLib.wlcSportsbook.betradarPopularEvents,
        ],
    };
}

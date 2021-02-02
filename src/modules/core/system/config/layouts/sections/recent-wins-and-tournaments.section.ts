import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace recentWinsAndTournaments {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcLastWinsSlider.def,
            componentLib.wlcBiggestWinsSlider.def,
        ],
    };
}

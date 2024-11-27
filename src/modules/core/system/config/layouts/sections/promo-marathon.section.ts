import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace promoMarathon {
    export const def: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcMarathon.def,
        ],
    };
}

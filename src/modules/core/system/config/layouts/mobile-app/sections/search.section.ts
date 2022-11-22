import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace searchSection {

    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcSearch.def,
        ],
    };
}

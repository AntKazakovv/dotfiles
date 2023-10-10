import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace youtubeBlockSection {
    export const home: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcYoutubeBlock.def,
        ],
    };
}

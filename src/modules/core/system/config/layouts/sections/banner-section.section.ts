import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace bannerSection {
    export const home: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcBannersSlider.home,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcSlider.catalog,
        ],
    };
}


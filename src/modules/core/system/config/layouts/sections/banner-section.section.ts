import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace bannerSection {
    export const home: ILayoutSectionConfig = {
        display: {
            auth: false,
        },
        container: true,
        components: [
            componentLib.wlcBannersSlider.home,
        ],
    };

    export const catalog: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBannersSlider.catalog,
        ],
    };

    export const affiliates: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcBannersSlider.affiliates,
        ],
    };
}

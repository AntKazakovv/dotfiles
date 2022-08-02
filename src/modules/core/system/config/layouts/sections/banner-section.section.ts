import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace bannerSection {
    export const home: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBannersSlider.home,
        ],
    };

    export const withEars: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcBannersSlider.withEars,
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

    export const steps: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcBannersSlider.home,
            componentLib.wlcPromoSteps.def,
        ],
    };

    export const plusOneWinnersAndBonuses: ILayoutSectionConfig = {
        container: true,
        theme: 'plus-one',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'wlc-banner-plus-one',
                    components: [
                        componentLib.wlcBannersSlider.home,
                        componentLib.wlcLastWinsSlider.bannerPlusOne,
                        componentLib.wlcBonusesList.bannerPlusOne,
                    ],
                },
            },
        ],
    };

    export const wide: ILayoutSectionConfig = {
        container: false,
        components: [
            componentLib.wlcBannersSlider.wide,
        ],
    };
}

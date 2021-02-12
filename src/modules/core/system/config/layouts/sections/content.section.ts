import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace content {
    export const empty: ILayoutSectionConfig = {
        container: true,
        components: [
        ],
    };

    export const gamePlay: ILayoutSectionConfig = {
        order: 2,
        components: [
            componentLib.wlcGameWrapper.def,
        ],
    };

    export const promotions: ILayoutSectionConfig = {
        order: 2,
        container: true,
        components: [
            componentLib.wlcTitle.promotions,
            componentLib.wlcPromotionsBonusesList.def,
            componentLib.wlcButton.toProfile,
        ],
    };

    export const error: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcErrorPage.def,
        ],
    };
}


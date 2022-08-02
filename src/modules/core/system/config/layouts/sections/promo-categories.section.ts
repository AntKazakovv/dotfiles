import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace promoCategories {
    export const def: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.wlcRandomGame.def,
            componentLib.wlcCategoryPreview.desktopDef,
            componentLib.wlcLastWinsSlider.withPromoCategories,
        ],
    };
}

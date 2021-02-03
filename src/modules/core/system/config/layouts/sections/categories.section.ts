import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace categories {
    export const catalog: ILayoutSectionConfig =  {
        container: true,
        theme: '1',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categories,
                        componentLib.wlcButton.search,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
    export const catalogWithIcons: ILayoutSectionConfig = {
        container: true,
        theme: '2',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categoriesWithIcons,
                        componentLib.wlcButton.searchV3,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
}

import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace categories {

    export const gamesSearch: ILayoutSectionConfig =  {
        container: true,
        theme: '1',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcButton.search,
                    ],
                },
            },
        ],
    };

    export const catalog: ILayoutSectionConfig =  {
        container: true,
        theme: 'mobile-app',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categoriesWithIcons,
                    ],
                },
            },
        ],
    };
}

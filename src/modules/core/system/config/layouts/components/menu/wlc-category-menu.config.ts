import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcCategoryMenu {
    export const categories: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            type: 'categories-menu',
        },
    };
    export const categoriesWithIcons: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        params: {
            theme: 'with-icons',
            type: 'categories-menu',
        },
    };
}

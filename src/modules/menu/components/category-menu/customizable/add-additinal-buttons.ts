import _find from 'lodash-es/find';

import {CategoryMenuComponent} from 'wlc-engine/modules/menu/components/category-menu/category-menu.component';

/**
 * Adds lobby and all game buttons for the first menu architecture
 */
export const addAdditionalButtonsDefault = function (this: CategoryMenuComponent): void {
    if (!this.menuSettings) {
        if (this.gamesCatalogService.catalogOpened()) {
            const parentInMenu: boolean = !!_find(this.categories, (category) => {
                return this.parentCategory.slug === category.slug;
            });
            if (!parentInMenu) {
                this.$params.menuParams.items.unshift(this.getAllGamesBtn());
            }
        }
        if (this.useLobbyBtn) {
            this.$params.menuParams.items.unshift(this.getLobbyBtn());
        }
    }
};

/**
 * Without additional buttons
 */
export const addAdditionalButtonsV2 = function (this: CategoryMenuComponent): void {
};

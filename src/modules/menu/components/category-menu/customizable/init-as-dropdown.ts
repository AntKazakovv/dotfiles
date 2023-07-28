import _forEach from 'lodash-es/forEach';
import _filter from 'lodash-es/filter';
import _isNil from 'lodash-es/isNil';

import {MenuHelper} from 'wlc-engine/modules/menu';
import {CategoryMenuComponent} from 'wlc-engine/modules/menu/components/category-menu/category-menu.component';
import {TCustomizableFn} from 'wlc-engine/modules/menu/components/category-menu/category-menu.params';

// TODO change this after #479773
export const initAsDropdownDefault: TCustomizableFn  = function (this: CategoryMenuComponent): void {
    const useIconsParentItem: boolean = !_isNil(this.$params.menuParams.dropdowns.expandableOnHover);
    const parentCategories = this.gamesCatalogService.getParentCategories();
    let dropdownMenu = [];

    const specialCategories = this.getSpecialCategories();
    if (specialCategories.length) {
        dropdownMenu = MenuHelper.getItemsForCategories({
            categories: specialCategories,
            lang: this.translateService.currentLang,
            icons: {
                folder: this.iconsFolder,
                disable: !useIconsParentItem,
            },
        });
    }

    _forEach(parentCategories, (category): void => {
        const menuItems = MenuHelper.getItemsForCategories({
            categories: [category],
            lang: this.translateService.currentLang,
            icons: {
                folder: this.iconsFolder,
                disable: !useIconsParentItem,
            },
        });
        if (category.childCategories.length) {
            const childItems = MenuHelper.getItemsForCategories({
                categories: category.childCategories,
                lang: this.translateService.currentLang,
                icons: {
                    folder: this.iconsFolder,
                    disable: !this.useIcons,
                    fallback: this.fallBackIcon,
                },
            });
            dropdownMenu.push({
                parent: menuItems[0],
                items: childItems,
                type: 'group',
            });
        } else if (menuItems[0]) {
            dropdownMenu.push(menuItems[0]);
        }
    });

    this.$params.menuParams.items = dropdownMenu;
};

/**
 * When you have multiple parent categories, each of which has a set of child categories
 *
 * Mobile category buttons:
 *
 * Favourites
 * LastPlayed
 * Dropdown Casino with subcategories
 * Dropdown Livecasino with subcategories
 */
// TODO change this after #479773
export const initAsDropdownV2: TCustomizableFn = function (this: CategoryMenuComponent): void {
    const parentCategories = this.gamesCatalogService.getParentCategories();
    let dropdownMenu = [];

    const specialCategories = _filter(this.gamesCatalogService.getCategories(), (category) => {
        return category.isParent && (category.isFavourites || category.isLastPlayed);
    });

    if (specialCategories.length) {
        dropdownMenu = MenuHelper.getItemsForCategories({
            categories: specialCategories,
            lang: this.translateService.currentLang,
            icons: {
                folder: this.iconsFolder,
                disable: true,
            },
        });
    }

    _forEach(parentCategories, (category): void => {
        const menuItems = MenuHelper.getItemsForCategories({
            categories: [category],
            lang: this.translateService.currentLang,
            icons: {
                folder: this.iconsFolder,
                disable: true,
            },
        });
        if (category.childCategories.length) {
            const childItems = MenuHelper.getItemsForCategories({
                categories: _filter(category.childCategories, (category) => {
                    return !category.isFavourites && !category.isLastPlayed;
                }),
                lang: this.translateService.currentLang,
                icons: {
                    folder: this.iconsFolder,
                    disable: !this.useIcons,
                    fallback: this.fallBackIcon,
                },
            });
            dropdownMenu.push({
                parent: menuItems[0],
                items: childItems,
                type: 'group',
            });
        } else if (menuItems[0]) {
            dropdownMenu.push(menuItems[0]);
        }
    });

    this.$params.menuParams.items = dropdownMenu;
};

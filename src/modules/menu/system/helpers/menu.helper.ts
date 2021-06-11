import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MenuConfigItemsGroup} from 'wlc-engine/modules/menu/components/menu/menu.params';

interface IParseConfigOptions {
    icons?: {
        folder?: string;
        disable?: boolean;
    }
}

import _isString from 'lodash-es/isString';
import _map from 'lodash-es/map';
import _isObject from 'lodash-es/isObject';
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isArray from 'lodash-es/isArray';

export class MenuHelper {

    /**
     * Get menu items
     *
     * @param {IHelperGetItemsParams} params
     * @returns {MenuItemObjectType[]}
     */
    public static getItems(params: Params.IHelperGetItemsParams): Params.MenuItemObjectType[] {

        const items: Params.MenuItemType[] = (_isArray(params?.items)) ? params.items : _get(wlcDefaultMenuItems, params.type, []),
            resultList: Params.MenuItemObjectType[] = [];

        _map(items, (item: Params.MenuItemType) => {
            if (_isString(item)) {
                const menuItem = _get(wlcMenuItemsGlobal, item);
                if (menuItem) {
                    resultList.push(_get(wlcMenuItemsGlobal, item));
                }
            } else if (_isObject(item)) {
                resultList.push(item);
            }
        });
        return resultList;
    }

    /**
     * Get menu items for categories
     *
     * @param params
     */
    public static getItemsForCategories(params: Params.IHelperGetItemsForCategories): Params.IMenuItem[] {
        return _map(params.categories, (category: CategoryModel) => {
            let itemParams: Params.IMenuItemParams = {
                state: {
                    name: 'app.catalog',
                    params: {
                        category: category.slug,
                    },
                },
                href: {
                    url: `/catalog/${category.slug}`,
                    baseSiteUrl: true,
                },
            };

            if (category.parentCategory) {
                itemParams = {
                    state: {
                        name: 'app.catalog.child',
                        params: {
                            category: category.parentCategory.slug,
                            childCategory: category.slug,
                        },
                    },
                    href: {
                        url: `/catalog/${category.parentCategory.slug}/${category.slug}`,
                        baseSiteUrl: true,
                    },
                };
            }

            let categoryIcon: string = '';
            const resolvedIcon = category.icon || params.icons.fallback;

            if (!params.icons?.disable && resolvedIcon) {
                const iconsFolder = _trim(params.icons?.folder, '/');
                categoryIcon = iconsFolder ? `${iconsFolder}/${resolvedIcon}` : resolvedIcon;
            }

            return {
                name: category.title[params.lang] || category.title['en'],
                type: 'sref',
                icon: categoryIcon,
                sort: category.sort || null,
                class: category.slug,
                wlcElement: (`${params.wlcElementPrefix}-` || 'link_game-categories-') + category.slug,
                params: itemParams,
            };
        });
    }

    /**
     * Parse menu config
     *
     * @param {MenuConfigItem[]} config
     * @param {IMenuItemsGlobal} globalItemsConfig
     * @returns {MenuItemObjectType[]}
     */
    public static parseMenuConfig(
        config: Params.MenuConfigItem[],
        globalItemsConfig: Params.IMenuItemsGlobal,
        options?: IParseConfigOptions): Params.MenuItemObjectType[] {

        const disableIcons: boolean = options?.icons?.disable;
        const iconsFolder: string = _trim(options?.icons?.folder, '/');

        return _map(config, (configMenuItem: Params.MenuConfigItem) => {
            if (_isString(configMenuItem)) {
                const menuItem: Params.IMenuItem = _cloneDeep(globalItemsConfig[configMenuItem]);
                MenuHelper.setIcon(menuItem, iconsFolder, disableIcons);
                return menuItem;
            } else {
                if (_has(configMenuItem, 'parent')) {
                    const item = configMenuItem as MenuConfigItemsGroup;
                    const parent: Params.IMenuItem = _cloneDeep(globalItemsConfig[item.parent]);
                    MenuHelper.setIcon(parent, iconsFolder, disableIcons);

                    const items: Params.IMenuItem[] = item.items?.map((item: string) => {
                        const itemData = _cloneDeep(globalItemsConfig[item]);
                        MenuHelper.setIcon(itemData, iconsFolder, disableIcons);
                        return itemData;
                    }) || [];

                    return {
                        parent: parent,
                        items: items,
                    };
                } else {
                    const item: Params.IMenuItem = _cloneDeep(configMenuItem as Params.IMenuItem);
                    MenuHelper.setIcon(item, iconsFolder, disableIcons);
                    return item;
                }
            }
        });
    }

    public static setIcon(item: Params.IMenuItem, iconsFolder: string, disable: boolean): void {
        if (item) {
            if (disable) {
                item.icon = '';
            } else if (item.icon && iconsFolder) {
                item.icon = `${iconsFolder}/${item.icon}`;
            }
        }
    }
}

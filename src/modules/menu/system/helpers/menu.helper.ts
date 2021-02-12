import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MenuConfigItemsGroup} from 'wlc-engine/modules/menu/components/menu/menu.params';

import {
    isString as _isString,
    get as _get,
    isArray as _isArray,
    isObject as _isObject,
    map as _map,
    has as _has,
} from 'lodash-es';

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
                };
            }
            return {
                name: category.title[params.lang] || category.title['en'],
                type: 'sref',
                icon: category.icon,
                class: category.slug,
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
    public static parseMenuConfig(config: Params.MenuConfigItem[], globalItemsConfig: Params.IMenuItemsGlobal): Params.MenuItemObjectType[] {
        const menuItems: Params.MenuItemObjectType[] = _map(config, (configMenuItem: Params.MenuConfigItem) => {
            if (_isString(configMenuItem)) {
                const menuItem: Params.IMenuItem = globalItemsConfig[configMenuItem];
                return menuItem;
            } else {
                if (_has(configMenuItem, 'parent')) {
                    const item = configMenuItem as MenuConfigItemsGroup;
                    const parent: Params.IMenuItem = globalItemsConfig[item.parent];
                    const items: Params.IMenuItem[] = item.items.map((item: string) => {
                        return globalItemsConfig[item];
                    });
                    const menuItem: Params.IMenuItemsGroup = {
                        parent: parent,
                        items: items,
                    };
                    return menuItem;
                } else {
                    const item: Params.IMenuItem = configMenuItem as Params.IMenuItem;
                    return item;
                }
            }
        });
        return menuItems;
    }
}

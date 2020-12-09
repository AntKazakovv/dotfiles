import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IMenuItemParams, MenuItemObjectType} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {MenuItemType} from 'wlc-engine/modules/menu/components/menu/menu.params';

import {
    isString as _isString,
    get as _get,
    isArray as _isArray,
    isObject as _isObject,
    map as _map,
} from 'lodash';
import {IMenuItemsGroup} from 'wlc-engine/modules/menu';
import {IMenuItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

export class MenuHelper {

    /**
     * Get menu items
     *
     * @param {IHelperGetItemsParams} params
     * @returns {MenuItemObjectType[]}
     */
    public static getItems(params: Params.IHelperGetItemsParams): MenuItemObjectType[] {

        const items: MenuItemType[] = (_isArray(params?.items)) ? params.items : _get(wlcDefaultMenuItems, params.type, []),
            resultList: MenuItemObjectType[] = [];

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
            let itemParams: IMenuItemParams = {
                state: {
                    name: 'app.catalog',
                    params: {
                        category: category.slug,
                    },
                },
            };
            if (params.openChildCatalog) {
                itemParams = {
                    state: {
                        name: 'app.catalog.child',
                        params: {
                            childCategory: category.slug,
                        },
                    },
                };
            }
            return {
                name: category.title[params.lang],
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
    public static parseMenuConfig(config: Params.MenuConfigItem[], globalItemsConfig: Params.IMenuItemsGlobal): MenuItemObjectType[] {
        const menuItems: MenuItemObjectType[] = _map(config, (configMenuItem: Params.MenuConfigItem) => {
            if (_isString(configMenuItem)) {
                const menuItem: IMenuItem = globalItemsConfig[configMenuItem];
                return menuItem;
            } else {
                const parent: IMenuItem = globalItemsConfig[configMenuItem.parent];
                const items: IMenuItem[] = configMenuItem.items.map((item: string) => {
                    return globalItemsConfig[item];
                });
                const menuItem: IMenuItemsGroup = {
                    parent: parent,
                    items: items,
                };
                return menuItem;
            }
        });
        return menuItems;
    }
}

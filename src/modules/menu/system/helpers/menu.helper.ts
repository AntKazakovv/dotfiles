import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';

import {
    isString as _isString,
    get as _get,
    isArray as _isArray,
    isObject as _isObject,
    map as _map,
} from 'lodash';
import {IHelperGetItemsForCategories} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IMenuItemParams} from 'wlc-engine/modules/menu/components/menu/menu.params';

export class MenuHelper {

    public static getItems(params: Params.IHelperGetItemsParams): Params.IMenuItem[] {
        const items = (_isArray(params?.items)) ? params.items : _get(wlcDefaultMenuItems, params.type, []),
            resultList: Params.IMenuItem[] = [];
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
                }
            }

            return {
                name: category.title[params.lang],
                type: 'sref',
                icon: category.icon,
                class: category.slug,
                params: itemParams
            };
        });
    }
}

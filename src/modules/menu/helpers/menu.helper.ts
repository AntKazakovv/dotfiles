import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
} from 'wlc-engine/modules/menu/config/menu.items.config';

import {
    isString as _isString,
    get as _get,
    isArray as _isArray,
    isObject as _isObject,
    map as _map,
} from 'lodash';

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
}

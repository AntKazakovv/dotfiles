import {
    MenuItemType,
    IMenuItem,
    IHelperGetItemsParams
} from 'wlc-engine/modules/menu/interfaces/menu.interface';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal
} from 'wlc-engine/modules/menu/config/menu.items.config';

import {
    isString as _isString,
    get as _get,
    isArray as _isArray,
    map as _map
} from 'lodash';

export class MenuHelper {

    public static getItems(params: IHelperGetItemsParams): IMenuItem[] {
        const items = (_isArray(params && params.items)) ? params.items : _get(wlcDefaultMenuItems, params.type, []),
            resultList: IMenuItem[] = [];
        _map(items, (item: MenuItemType) => {
            if (_isString(item)) {
                const menuItem = _get(wlcMenuItemsGlobal, item);
                if (menuItem) {
                    resultList.push(_get(wlcMenuItemsGlobal, item));
                }
            }
        });
        return resultList;
    }
}

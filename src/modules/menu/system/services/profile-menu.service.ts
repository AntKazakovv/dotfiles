import {
    Injectable,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    IMenuItem,
    MenuItemObjectType,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {
    IProfileMenuFilter,
    IProfileMenuItemsGroup,
} from 'wlc-engine/modules/menu/components/profile-menu/profile-menu.params';
import {
    wlcProfileMenuItemsDefault,
    wlcProfileMenuItemsGlobal,
    profileMenuFilter,
} from 'wlc-engine/modules/menu/system/config/profile-menu.config';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/profile-menu.config';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import {
    get as _get,
    forEach as _forEach,
    cloneDeep as _cloneDeep,
    filter as _filter,
    isObject as _isObject,
    isString as _isString,
    startsWith as _startsWith,
    findKey as _findKey,
    reduce as _reduce,
    includes as _includes,
    find as _find,
    map as _map,
} from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class ProfileMenuService {

    protected profileMenuConfig: MenuParams.MenuConfigItem[];
    protected tabsMenu: IMenuItem[];
    protected subMenu: IIndexing<IMenuItem[]> = {};
    protected dropdownMenu: MenuItemObjectType[] = [];

    constructor(
        protected configService: ConfigService,
        protected stateSerivce: StateService,
    ) {
        this.initConfig();
    }

    /**
     * Get menu for type 'tabs'
     *
     * @returns {IMenuItem[]}
     */
    public getTabsMenu(): IMenuItem[] {
        if (!this.tabsMenu) {
            this.tabsMenu = this.profileMenuConfig.map((item: MenuParams.MenuConfigItem) => {
                if (_isString(item)) {
                    return wlcProfileMenuItemsGlobal[item];
                } else if (item.parent) {
                    return wlcProfileMenuItemsGlobal[item.parent];
                }
            });
        }
        return this.tabsMenu;
    }

    /**
     * Get menu for type 'submenu'
     *
     * @returns {IMenuItem[]}
     */
    public getSubMenu(): IMenuItem[] {
        const state = this.stateSerivce.current.name;
        if (this.subMenu[state]) {
            return this.subMenu[state];
        }

        const parentInMenuConfig: MenuParams.MenuConfigItemsGroup = _find(this.profileMenuConfig, (item: MenuParams.MenuConfigItem) => {
            if (!_isString(item)) {
                for (const subitemAlias of item.items) {
                    const subitem = Config.wlcProfileMenuItemsGlobal[subitemAlias];
                    if (subitem && subitem.params?.state?.name === state) {
                        return true;
                    }
                }
            }
            return false;
        }) as MenuParams.MenuConfigItemsGroup;

        let items: MenuParams.IMenuItem[] = [];
        if (parentInMenuConfig) {
            items = _map(parentInMenuConfig.items, (itemAlias: string) => {
                const menuItem: MenuParams.IMenuItem = Config.wlcProfileMenuItemsGlobal[itemAlias];
                return menuItem;
            });
            this.subMenu[state] = items;
        }
        return items;
    }

    /**
     * Get dropdown menu for mobile version
     *
     * @returns {MenuItemObjectType[]}
     */
    public getDropdownMenu(): MenuItemObjectType[] {
        if (!this.dropdownMenu.length) {
            this.dropdownMenu = MenuHelper.parseMenuConfig(this.profileMenuConfig, Config.wlcProfileMenuItemsGlobal);
        }
        return this.dropdownMenu;
    }

    /**
     * Init config of menu
     */
    protected initConfig(): void {
        const configMenu = this.configService.get<MenuParams.MenuConfigItem[]>('$base.profileMenu');
        this.profileMenuConfig = configMenu || wlcProfileMenuItemsDefault;
        this.filterConfig();
        GlobalHelper.deepFreeze(this.profileMenuConfig);
    }

    /**
     * Filter config menu
     */
    protected filterConfig(): void {
        const notUsed: string[] = [];
        _forEach(profileMenuFilter, (filterItem: IProfileMenuFilter) => {
            const use: boolean = this.configService.get<boolean>(filterItem.config);
            if (!use) {
                notUsed.push(filterItem.item);
            }
        });

        this.profileMenuConfig = _reduce(this.profileMenuConfig, (sum: MenuParams.MenuConfigItem[], item: MenuParams.MenuConfigItem) => {
            if (_isString(item) && _includes(notUsed, item)) {
                return sum;
            } else if (_get(item, 'parent')) {
                const itemsGroup = item as IProfileMenuItemsGroup<string>;
                const parentItem: string = itemsGroup.parent;
                if (_includes(notUsed, parentItem)) {
                    return sum;
                }
                itemsGroup.items = _filter(itemsGroup.items, (item: string) => {
                    return !_includes(notUsed, item);
                });
                sum.push(itemsGroup);
                return sum;
            }
            sum.push(item);
            return sum;
        }, []);
    }

}

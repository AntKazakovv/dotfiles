import {
    Injectable,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    IMenuItem,
    IMenuItemsGroup,
    MenuItemObjectType,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {
    IProfileMenuFilter,
    IProfileMenuItemsGroup,
} from 'wlc-engine/modules/menu/components/profile-menu/profile-menu.params';
import {
    wlcProfileMenuItemsGlobal,
    profileMenuFilter,
} from 'wlc-engine/modules/menu/system/config/profile-menu.config';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/profile-menu.config';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

export interface IMenuOptions {
    icons?: {
        folder?: string;
        disable?: boolean;
    }
}

import _cloneDeep from 'lodash-es/cloneDeep';
import _isString from 'lodash-es/isString';
import _reduce from 'lodash-es/reduce';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';

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
        protected stateService: StateService,
    ) {
        this.initConfig();
    }

    /**
     * Get menu for type 'tabs'
     *
     * @returns {IMenuItem[]}
     */
    public getTabsMenu(options?: IMenuOptions): IMenuItem[] {
        if (!this.tabsMenu) {
            const disbaleIcons: boolean = options?.icons?.disable;
            const iconsFolder: string = options?.icons?.folder;

            this.tabsMenu = this.profileMenuConfig.map((item: MenuParams.MenuConfigItem) => {
                let menuItem;
                if (_isString(item)) {
                    menuItem = _cloneDeep(wlcProfileMenuItemsGlobal[item]);
                } else if (_has(item, 'parent')) {
                    menuItem = _cloneDeep(wlcProfileMenuItemsGlobal[_get(item, 'parent')]);
                } else if (_has(item, 'name')) {
                    menuItem = _cloneDeep(item);
                }
                MenuHelper.setIcon(menuItem, iconsFolder, disbaleIcons);
                return menuItem;
            });
        }
        return this.tabsMenu;
    }

    /**
     * reinit menu
     */
    public resetMenu(): void {
        this.tabsMenu = null;
        this.subMenu = {};
        this.initConfig();
    }
    /**
     * Get menu for type 'submenu'
     *
     * @returns {IMenuItem[]}
     */
    public getSubMenu(options?: IMenuOptions): IMenuItem[] {
        const state = this.stateService.current.name;
        if (this.subMenu[state]) {
            return this.subMenu[state];
        }

        const parentInMenuConfig: MenuParams.MenuConfigItemsGroup = _find(this.profileMenuConfig, (item: MenuParams.MenuConfigItem) => {
            if (!_isString(item) && _has(item, 'items')) {
                for (const subitemAlias of _get(item, 'items')) {
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
            const disableIcons: boolean = options?.icons?.disable;
            const iconsFolder: string = options?.icons?.folder;

            items = _map(parentInMenuConfig.items, (itemAlias: string) => {
                const menuItem: MenuParams.IMenuItem = _cloneDeep(Config.wlcProfileMenuItemsGlobal[itemAlias]);
                MenuHelper.setIcon(menuItem, iconsFolder, disableIcons);
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
    public getDropdownMenu(options?: IMenuOptions): MenuItemObjectType[] {
        if (!this.dropdownMenu.length) {
            this.dropdownMenu = MenuHelper.parseMenuConfig(this.profileMenuConfig, Config.wlcProfileMenuItemsGlobal, options);
        }
        return this.dropdownMenu;
    }

    /**
     * Init config of menu
     */
    protected initConfig(): void {
        this.profileMenuConfig = this.configService.get<string>('$base.profile.type') === 'first'
            ? this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileFirstMenu.items')
            : this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileMenu.items');
        this.filterConfig();
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

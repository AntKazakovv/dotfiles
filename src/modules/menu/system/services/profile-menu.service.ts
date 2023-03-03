import {
    Injectable,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import _cloneDeep from 'lodash-es/cloneDeep';
import _isString from 'lodash-es/isString';
import _reduce from 'lodash-es/reduce';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _findIndex from 'lodash-es/findIndex';
import _forEach from 'lodash-es/forEach';

import {
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    IMenuItem,
    MenuItemObjectType,
    MenuItemsGroupParent,
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
import {
    StoreService,
} from 'wlc-engine/modules/store';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category';

import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Config from 'wlc-engine/modules/menu/system/config/profile-menu.config';

export interface IMenuOptions {
    icons?: {
        folder?: string;
        disable?: boolean;
    }
}

@Injectable({
    providedIn: 'root',
})
export class ProfileMenuService {

    protected readyStatus: Deferred<void> = new Deferred<void>();
    protected ready: Promise<void>;
    protected profileMenuConfig: MenuParams.MenuConfigItem[];
    protected tabsMenu: IMenuItem[];
    protected subMenu: IIndexing<IMenuItem[]> = {};
    protected dropdownMenu: MenuItemObjectType[] = [];
    protected useStore: boolean;

    constructor(
        protected configService: ConfigService,
        protected stateService: StateService,
        protected injectionService: InjectionService,
    ) {
        this.ready = this.readyStatus.promise;
        this.init();
    }

    /**
     * Get menu for type 'tabs'
     *
     * @returns {IMenuItem[]}
     */
    public async getTabsMenu(options?: IMenuOptions): Promise<IMenuItem[]> {
        await this.ready;

        if (!this.tabsMenu) {
            const disbaleIcons: boolean = options?.icons?.disable;
            const iconsFolder: string = options?.icons?.folder;

            this.tabsMenu = this.profileMenuConfig.map((item: MenuParams.MenuConfigItem) => {
                let menuItem;
                if (_isString(item)) {
                    menuItem = _cloneDeep(wlcProfileMenuItemsGlobal[item]);
                } else if (_has(item, 'parent')) {
                    const parent: MenuItemsGroupParent = _get(item, 'parent');
                    menuItem = _cloneDeep(
                        _isString(parent) ? wlcProfileMenuItemsGlobal[parent] : parent,
                    );
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
    public async getSubMenu(options?: IMenuOptions): Promise<IMenuItem[]> {
        await this.ready;

        const state = this.stateService.current.name;
        if (this.subMenu[state]) {
            return this.subMenu[state];
        }

        const parentInMenuConfig: MenuParams.MenuConfigItemsGroup = _find(
            this.profileMenuConfig, (item: MenuParams.MenuConfigItem) => {
                if (_has(item, 'items')) {
                    for (const subItemData of _get(item, 'items')) {
                        const subItem = _isString(subItemData)
                            ? Config.wlcProfileMenuItemsGlobal[subItemData]
                            : subItemData;

                        if (subItem && subItem.params?.state?.name === state) {
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

            items = _map(parentInMenuConfig.items, (itemData: string | MenuParams.IMenuItem): MenuParams.IMenuItem => {
                const menuItem: MenuParams.IMenuItem = _cloneDeep(_isString(itemData)
                    ? Config.wlcProfileMenuItemsGlobal[itemData]
                    : itemData,
                );
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
    public async getDropdownMenu(options?: IMenuOptions): Promise<MenuItemObjectType[]> {
        await this.ready;

        if (!this.dropdownMenu.length) {
            this.dropdownMenu =
                MenuHelper.parseMenuConfig(this.profileMenuConfig, Config.wlcProfileMenuItemsGlobal, options);
        }
        return this.dropdownMenu;
    }

    /**
     * Prepare profile market
     */
    protected async prepareMarket(): Promise<void> {
        let marketItemIndex: number = _findIndex(this.profileMenuConfig, (item: MenuParams.MenuConfigItem): boolean => {
            if (_isString(item)) {
                const menuItem = Config.wlcProfileMenuItemsGlobal[item];
                return menuItem.type === 'market';
            } else {
                if (_has(item, 'parent')) {
                    return (item as MenuParams.MenuConfigItemsGroup).parent == 'profile-menu:market';
                }
                return item?.type === 'market';
            }
        });

        if (marketItemIndex !== -1) {
            const storeService: StoreService = await this.injectionService.getService('store.store-service');
            const categories: StoreCategory[] = await storeService.getCategories();

            let storeCategories: StoreCategory[] = _filter(
                categories, (category: StoreCategory): boolean => {
                    return category.isEnabled;
                });

            const menuItems: MenuParams.IMenuItem[] = _map(
                storeCategories, (category: StoreCategory): IMenuItem => {
                    return {
                        name: category.nameTranslations(),
                        noTranslate: !category.isAllGoods,
                        type: 'sref',
                        icon: 'store-category',
                        class: 'store-category',
                        wlcElement: 'link_cc-profile-menu_store-category',
                        params: {
                            state: {
                                name: 'app.profile.loyalty-store.main',
                                params: {
                                    category: category.id || undefined,
                                },
                            },
                        },
                    };
                });

            this.profileMenuConfig[marketItemIndex] = {
                parent: 'profile-menu:market',
                type: 'group',
                items: menuItems,
            };
        }
    }

    /**
     * Init profile menu
     *
     * @returns {Promise<void>}
     */
    protected async init(): Promise<void> {
        this.initConfig();
        this.useStore = this.configService.get<boolean>('$base.profile.store.use');

        if (this.useStore) {
            await this.prepareMarket();
        }
        this.readyStatus.resolve();
    }

    /**
     * Init config of menu
     */
    protected initConfig(): void {
        if (this.configService.get('$base.app.type') === 'kiosk') {
            this.profileMenuConfig =
                this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileKioskMenu.items');
        } else if (this.configService.get<string>('$base.profile.type') === 'first') {
            this.configService.get<boolean>('$bonuses.unitedPageBonuses') ?
                this.profileMenuConfig =
                this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileFirstMenuUnitedBonuses.items') :
                this.profileMenuConfig =
                this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileFirstMenu.items');
        } else {
            this.profileMenuConfig = this.configService.get<MenuParams.MenuConfigItem[]>('$menu.profileMenu.items');
        }

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

        this.profileMenuConfig =
            _reduce(this.profileMenuConfig, (sum: MenuParams.MenuConfigItem[], item: MenuParams.MenuConfigItem) => {
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

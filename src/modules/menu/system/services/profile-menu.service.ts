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
    BehaviorSubject,
    firstValueFrom,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
} from 'rxjs/operators';

import {
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    IMenuItem,
    MenuItemObjectType,
    MenuItemsGroupItem,
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
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category.model';
import {UserInfo} from 'wlc-engine/modules/user';
import {
    AchievementGroupModel,
    AchievementsService,
} from 'wlc-engine/modules/loyalty/submodules/achievements';
import {
    QuestModel,
    QuestsService,
} from 'wlc-engine/modules/quests';

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

    protected readyStatus: Deferred<void>;
    protected ready: Promise<void>;
    protected profileMenuConfig: MenuParams.MenuConfigItem[];
    protected tabsMenu: IMenuItem[];
    protected subMenu: IIndexing<IMenuItem[]> = {};
    protected dropdownMenu: MenuItemObjectType[] = [];

    constructor(
        protected configService: ConfigService,
        protected stateService: StateService,
        protected injectionService: InjectionService,
    ) {
        this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$')
            .pipe(distinctUntilChanged())
            .subscribe(async (): Promise<void> => {
                this.readyStatus = new Deferred<void>();
                this.ready = this.readyStatus.promise;

                this.resetMenu();
                await this.init();

                this.readyStatus.resolve();
            });
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
                let menuItem: IMenuItem | undefined;
                if (_isString(item)) {
                    menuItem = _cloneDeep(wlcProfileMenuItemsGlobal[item]);
                } else if (_has(item, 'parent')) {
                    const parent: MenuItemsGroupParent = _get(item, 'parent');
                    menuItem = _cloneDeep(
                        _isString(parent) ? wlcProfileMenuItemsGlobal[parent] : parent,
                    );
                } else if (_has(item, 'name')) {
                    menuItem = _cloneDeep(item as IMenuItem);
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
        this.dropdownMenu = [];
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

        const state: string = this.stateService.current.name;
        if (this.subMenu[state]) {
            return this.subMenu[state];
        }

        const parentInMenuConfig: MenuParams.MenuConfigItemsGroup = _find(
            this.profileMenuConfig, (item: MenuParams.MenuConfigItem) => {
                if (_has(item, 'items')) {
                    for (const subItemData of _get(item, 'items', [])) {
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

            if (this.configService.get<boolean>('$base.stickyHeader.use')) {
                options = Object.assign(options,
                    {
                        isSingleLevelMenu: true,
                    },
                );
            }
            this.dropdownMenu =
                MenuHelper.parseMenuConfig(this.profileMenuConfig, Config.wlcProfileMenuItemsGlobal, options);
        }
        return this.dropdownMenu;
    }

    /**
     * Get menu for type 'full'
     *
     * @returns {MenuItemObjectType[]}
     */
    public async getFullMenu(options?: IMenuOptions): Promise<MenuItemObjectType[]> {
        await this.ready;
        return MenuHelper.parseMenuConfig(this.profileMenuConfig, Config.wlcProfileMenuItemsGlobal, options);
    }

    /**
     * Prepare profile market
     */
    protected async prepareMarket(): Promise<void> {
        let marketItemIndex: number = _findIndex(this.profileMenuConfig, (item: MenuParams.MenuConfigItem): boolean => {
            if (_isString(item)) {
                const menuItem = Config.wlcProfileMenuItemsGlobal[item];
                return menuItem?.type === 'market';
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

            if (this.configService.get<string>('$base.profile.type') === 'first') {
                const ordersHistoryItem: MenuParams.IMenuItem = {
                    name: gettext('Purchase history'),
                    type: 'sref',
                    icon: 'store-category',
                    class: 'store-category',
                    wlcElement: 'link_cc-profile-menu_store-category',
                    params: {
                        state: {
                            name: 'app.profile.loyalty-store.history',
                            params: {},
                        },
                    },
                };

                menuItems.push(ordersHistoryItem);
            }

            this.profileMenuConfig[marketItemIndex] = {
                parent: 'profile-menu:market',
                type: 'group',
                items: menuItems,
            };
        }
    }

    /**
     * Prepare orders history in profile menu
     */
    protected prepareOrdersHistory(): void {
        const historyMenuIndex: number = this.profileMenuConfig.findIndex((item: MenuParams.MenuConfigItem) => {
            if (Object.getOwnPropertyNames(item).includes('parent')) {
                return (item as MenuParams.MenuConfigItemsGroup).parent === 'profile-menu:history'
             || (item as MenuParams.MenuConfigItemsGroup).parent === 'profile-first-menu:history';
            }
        });

        if (historyMenuIndex !== -1) {
            const ordersHistoryItem: string = 'profile-menu:orders-history';

            // eslint-disable-next-line max-len
            const isOrdersInMenu: boolean = (this.profileMenuConfig[historyMenuIndex] as MenuParams.MenuConfigItemsGroup)
                .items.findIndex((value: MenuItemsGroupItem) => value === ordersHistoryItem) !== -1;

            if (!isOrdersInMenu) {
                const lastHistoryItemIndex: number = this.profileMenuConfig.length - 1;
                (this.profileMenuConfig[historyMenuIndex] as MenuParams.MenuConfigItemsGroup).items
                    .splice(lastHistoryItemIndex + 1, 0, ordersHistoryItem);
            }
        }
    }

    /**
     * Prepare profile achievements
     */
    protected async prepareAchievements(): Promise<void> {
        let achievementItemIndex: number = _findIndex(
            this.profileMenuConfig,
            (item: MenuParams.MenuConfigItem): boolean => {
                if (_isString(item)) {
                    const menuItem: IMenuItem = Config.wlcProfileMenuItemsGlobal[item];

                    return menuItem?.type === 'achievement';
                } else {
                    if (_has(item, 'parent')) {
                        return (item as MenuParams.MenuConfigItemsGroup).parent == 'profile-menu:achievements';
                    }

                    return item.type === 'achievement';
                }
            },
        );

        if (achievementItemIndex !== -1) {
            const achievementsService: AchievementsService =
                await this.injectionService.getService('achievements.achievement-service');
            const groups: AchievementGroupModel[] = await achievementsService.getGroups();

            const menuItems: MenuParams.IMenuItem[] = _map(
                groups,
                (group: AchievementGroupModel): IMenuItem => {
                    return {
                        name: group.name,
                        noTranslate: !group.isCommon,
                        type: 'sref',
                        icon: 'achievement-group',
                        class: 'achievement-group',
                        wlcElement: 'link_cc-profile-menu_achievements-group',
                        params: {
                            state: {
                                name: 'app.profile.achievements.main',
                                params: {
                                    group: group.isCommon ? undefined : group.id,
                                },
                            },
                        },
                    };
                });

            this.profileMenuConfig[achievementItemIndex] = {
                parent: 'profile-menu:achievements',
                type: 'group',
                items: menuItems,
            };
        }
    }

    /**
     * Prepare profile quests
     */
    protected async prepareQuests(): Promise<void> {
        let questItemIndex: number = _findIndex(
            this.profileMenuConfig,
            (item: MenuParams.MenuConfigItem): boolean => {
                if (_isString(item)) {
                    const menuItem: IMenuItem = Config.wlcProfileMenuItemsGlobal[item];

                    return menuItem?.type === 'quest';
                } else {
                    if (_has(item, 'parent')) {
                        return (item as MenuParams.MenuConfigItemsGroup).parent == 'profile-menu:quests';
                    }

                    return item.type === 'quest';
                }
            },
        );

        if (questItemIndex !== -1) {
            const questsService: QuestsService =
                await this.injectionService.getService('quests.quests-service');

            const quests: QuestModel[] = await questsService.getQuestsArray(true);

            const menuItems: MenuParams.IMenuItem[] = _map(
                quests,
                (quest: QuestModel): IMenuItem => {
                    return {
                        name: quest.name,
                        type: 'sref',
                        icon: 'quest',
                        class: 'quest',
                        wlcElement: 'link_cc-profile-menu_quest',
                        params: {
                            state: {
                                name: 'app.profile.quests.main',
                                params: {
                                    questId: quest.id,
                                },
                            },
                        },
                    };
                });

            this.profileMenuConfig[questItemIndex] = {
                parent: 'profile-menu:quests',
                type: 'group',
                items: menuItems.length > 1 ? menuItems : [],
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

        if (this.configService.get<boolean>('$base.profile.store.use')) {
            await this.prepareMarket();
            this.prepareOrdersHistory();
        }

        if (this.configService.get('$base.profile.transfers.use')) {
            await this.prepareTransfer();
        }

        if (this.configService.get<boolean>('$base.profile.achievements.use')) {
            await this.prepareAchievements();
        }

        if (this.configService.get<boolean>('$base.profile.quests.use')) {
            await this.prepareQuests();
        }
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

    protected async prepareTransfer(): Promise<void> {
        const userInfo: UserInfo = await firstValueFrom(this.configService
            .get<BehaviorSubject<UserInfo>>('$user.userInfo$')
            .pipe(
                filter((userInfo: UserInfo): boolean => !!userInfo?.idUser),
            ),
        );

        if (!userInfo.transfersAllowed) {
            this.profileMenuConfig = this.removeMenuItemsByState(
                _cloneDeep(this.profileMenuConfig),
                'app.profile.cash.transfer',
            );
        }
    }

    private removeMenuItemsByState(items: MenuParams.MenuConfigItem[], state: string): MenuParams.MenuConfigItem[] {
        return _filter(items, (item: MenuParams.MenuConfigItem): boolean => {
            if (_isString(item)) {
                const menuItem: IMenuItem = Config.wlcProfileMenuItemsGlobal[item];
                return menuItem?.params?.state?.name !== state;
            } else if ((item as IMenuItem)?.params?.state?.name) {
                return (item as IMenuItem).params.state.name !== state;
            } else if ('parent' in item) {
                item.items = this.removeMenuItemsByState(item.items, state);
                return !!item.items.length;
            } else {
                return false;
            }
        });
    }
}

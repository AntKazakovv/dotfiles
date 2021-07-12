import {
    MenuConfigItem,
    MenuConfigItemsGroup,
    MenuItemsGroupItem,
    MenuItemObjectType,
    MenuItemType,
    MenuType,
    IMenuItemParams,
    IMenuItemsGlobal,
    IHelperGetItemsForCategories,
    IHelperGetItemsParams,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcDefaultMenuItems,
    wlcMenuItemsGlobal,
    wlcMenuItemGroupsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';
import {
    CategoryModel,
} from 'wlc-engine/modules/games';
import {
    IMenuItem,
    IMenuOptions,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';

import _isString from 'lodash-es/isString';
import _map from 'lodash-es/map';
import _isObject from 'lodash-es/isObject';
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isArray from 'lodash-es/isArray';
import _reduce from 'lodash-es/reduce';
import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';

export interface IParseConfigOptions {
    icons?: {
        folder?: string;
        disable?: boolean;
    }
}

export interface IParseSettingsOptions {
    isAuth: boolean;
    wlcElementPrefix?: string;
}

export class MenuHelper {

    /**
     * Get menu items
     *
     * @param {IHelperGetItemsParams} params
     * @returns {MenuItemObjectType[]}
     */
    public static getItems(params: IHelperGetItemsParams): MenuItemObjectType[] {

        const items: MenuItemType[] = (_isArray(params?.items)) ? params.items : _get(wlcDefaultMenuItems, params.type, []);
        let resultList: MenuItemObjectType[] = [];

        _map(items, (item: MenuItemType) => {
            if (_isString(item)) {
                const menuItem = _get(wlcMenuItemsGlobal, item);
                if (menuItem) {
                    resultList.push(_get(wlcMenuItemsGlobal, item));
                }
            } else if (_isObject(item)) {
                resultList.push(item);
            }
        });

        resultList = _filter(resultList, (item) => {
            switch (_get(item, 'device')) {
                case 'mobile':
                    return params.isMobile;
                case 'desktop':
                    return !params.isMobile;
                default:
                    return true;
            }
        });

        resultList = _filter(resultList, (item) => {
            switch (_get(item, 'auth')) {
                case true:
                    return params.isAuth;
                default:
                    return true;
            }
        });

        return resultList;
    }

    /**
     * Get menu items for categories
     *
     * @param params
     */
    public static getItemsForCategories(params: IHelperGetItemsForCategories): Params.IMenuItem[] {
        return _map(params.categories, (category: CategoryModel) => {
            let itemParams: IMenuItemParams = {
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
        config: MenuConfigItem[],
        globalItemsConfig: IMenuItemsGlobal,
        options?: IParseConfigOptions): MenuItemObjectType[] {

        const disableIcons: boolean = options?.icons?.disable;
        const iconsFolder: string = _trim(options?.icons?.folder, '/');

        return _map(config, (configMenuItem: MenuConfigItem) => {
            if (_isString(configMenuItem)) {
                const menuItem: Params.IMenuItem = _cloneDeep(globalItemsConfig[configMenuItem]);
                MenuHelper.setIcon(menuItem, iconsFolder, disableIcons);
                return menuItem;
            } else {
                if (_has(configMenuItem, 'parent')) {
                    const item = configMenuItem as MenuConfigItemsGroup;
                    const parent: Params.IMenuItem = _isObject(item.parent) ? item.parent : _cloneDeep(globalItemsConfig[item.parent]);
                    MenuHelper.setIcon(parent, iconsFolder, disableIcons);

                    const items: MenuItemObjectType[] = item.items?.map((item: MenuItemsGroupItem) => {
                        if (_has(item, 'parent')) {
                            const dropdownItems = MenuHelper.parseMenuConfig((item as MenuConfigItemsGroup).items, globalItemsConfig, options);
                            return {
                                parent: item['parent'],
                                items: dropdownItems,
                            };
                        }

                        const itemData: Params.IMenuItem = _isObject(item) ? item as Params.IMenuItem : _cloneDeep(globalItemsConfig[item]);
                        MenuHelper.setIcon(itemData, iconsFolder, disableIcons);
                        return itemData;
                    }) || [];

                    return {
                        parent: parent,
                        items: items,
                        type: 'group',
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
                item.iconUrl = '';
            } else if (item.icon && iconsFolder) {
                item.icon = `${iconsFolder}/${item.icon}`;
            }
        }
    }

    /**
     * Parse menu settings (which come from fundist)
     *
     * @param {IMenuOptions} settings
     * @param {MenuType} type
     * @param {string} lang
     * @param {IParseSettingsOptions} options
     * @returns {MenuConfigItem[]}
     */
    public static parseMenuSettings(settings: IMenuOptions, type: MenuType, lang: string, options: IParseSettingsOptions): MenuConfigItem[] {
        return MenuHelper.geiItemsByMenuSettings(settings.items, type, lang, options);
    }

    /**
     * Get items by menu settings
     *
     * @param {IMenuItem[]} items
     * @param {MenuType} type
     * @param {string} lang
     * @param {IParseSettingsOptions} options
     * @returns {*}
     */
    protected static geiItemsByMenuSettings(items: IMenuItem[], type: MenuType, lang: string, options: IParseSettingsOptions): MenuConfigItem[] {

        return _reduce(_orderBy(items, 'order', 'asc'), (items: MenuConfigItem[], item: IMenuItem) => {
            const authRequired: boolean = !options.isAuth && _includes(['favourites', 'lastplayed'], item.id);

            if (item.type === 'dropdown') {
                const dropdownItems: MenuConfigItem[] = MenuHelper.geiItemsByMenuSettings(item.items, type, lang, options);
                const parentItem: Params.IMenuItem = {
                    name: item.name[lang] || item.name['en'],
                    type: 'sref',
                };
                const dropdownItem: MenuConfigItemsGroup = {
                    type: 'group',
                    parent: parentItem,
                    items: dropdownItems,
                };
                items.push(dropdownItem);

            } else if (item.type === 'page') {
                const itemId: string = `${type}:${item.id}`;
                const menuItem = _cloneDeep(_get(wlcMenuItemGroupsGlobal, itemId) || _get(wlcMenuItemsGlobal, itemId));
                if (menuItem) {
                    if (_has(menuItem, 'parent')) {
                        const parentItem = _cloneDeep(_get(wlcMenuItemsGlobal, _get(menuItem, 'parent')));
                        parentItem.iconUrl = item.iconUrl;
                        _set(parentItem, 'device', item.device || 'all');
                        _set(parentItem, 'auth', authRequired);
                        _set(menuItem, 'parent', parentItem);
                    } else {
                        if (item.iconUrl) {
                            if (_get(menuItem, 'icon')) {
                                delete (menuItem as Params.IMenuItem).icon;
                            }
                            _set(menuItem, 'iconUrl', item.iconUrl);
                        }
                        _set(menuItem, 'device', item.device || 'all');
                        _set(menuItem, 'auth', authRequired);
                    }
                    items.push(menuItem);
                }

            } else if (item.type === 'category') {
                const wlcElement: string = (options?.wlcElementPrefix || `link_${type}-nav-`) + item.id;
                const menuItem: Params.IMenuItem = {
                    name: item.name[lang] || item.name['en'],
                    type: 'sref',
                    class: item.id,
                    icon: item.id,
                    iconUrl: item.iconUrl,
                    params: {
                        state: {
                            name: 'app.catalog',
                            params: {
                                category: item.id,
                            },
                        },
                    },
                    device: item.device || 'all',
                    auth: authRequired,
                    wlcElement: wlcElement,
                };
                items.push(menuItem);
            }
            return items;
        }, []);
    }
}

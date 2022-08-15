import _isString from 'lodash-es/isString';
import _map from 'lodash-es/map';
import _isObject from 'lodash-es/isObject';
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import _reduce from 'lodash-es/reduce';
import _orderBy from 'lodash-es/orderBy';
import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _sortBy from 'lodash-es/sortBy';
import _forEach from 'lodash-es/forEach';

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
    ItemType,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    wlcMenuItemsGlobal,
    wlcMenuItemGroupsGlobal,
} from 'wlc-engine/modules/menu/system/config/menu.items.config';
import {
    CategoryModel,
} from 'wlc-engine/modules/games/system/models';
import {
    IMenuItem,
    IMenuOptions,
} from 'wlc-engine/modules/core/system/interfaces';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {ICategoryMenuCParams} from 'wlc-engine/modules/menu/components/category-menu/category-menu.params';
import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IGetItemsByWpPosts {
    posts: TextDataModel[];
    defaultItemState: string,
    defaultItemType: Params.WpItemType,
    hrefBasePath?: string;
    wlcElementPrefix?: string;
}

export interface IGetHrefItemBasePath {
    url: string;
    lang?: string;
    page?: string;
}

export interface IParseConfigOptions {
    icons?: {
        /** icon folder */
        folder?: string;
        /** disable use icon */
        disable?: boolean;
        /** fallback icon if the main one cannot be loaded */
        fallback?: string;
    },
    /** hide category menu */
    notUseCategoryMenu?: boolean;
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

        let resultList: MenuItemObjectType[] = [];

        _map(params.items, (item: MenuItemType) => {
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
                case false:
                    return !params.isAuth;
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
                wlcElement: (params.wlcElementPrefix || 'link_game-categories-') + category.slug,
                params: itemParams,
            };
        });
    }

    /**
     * Get menu items by wordpress posts data
     *
     * @param {TextDataModel[]} posts Wordpress articles
     * @param {string} defaultState Default state for menu items, if it is not specified in the article params
     * @returns {IMenuItem[]}
     */
    public static getItemsByWpPosts(options: IGetItemsByWpPosts) {
        const wpItems: TextDataModel[] = _sortBy(options.posts, (item) => item.sortOrder);
        const menuItems: Params.IMenuItem[] = [];

        _forEach(wpItems, (wpItem) => {
            const type: ItemType = wpItem.outerLink ? 'href' : options.defaultItemType || 'sref';
            const wlcElement: string = options.wlcElementPrefix ? options.wlcElementPrefix + wpItem.slug : '';

            let params: IMenuItemParams;

            if (type === 'href') {
                let basePath: string;
                let url: string;

                if (wpItem.outerLink) {
                    url = _includes(wpItem.outerLink, '//') ? wpItem.outerLink : '//' + wpItem.outerLink;
                } else {
                    basePath = options.hrefBasePath || '';
                    url = basePath + wpItem.slug;
                }
                params = {
                    href: {
                        url,
                        baseSiteUrl: !wpItem.outerLink && !basePath,
                    },
                    target: wpItem.outerLink ? '_blank' : '_self',
                };
            } else {
                params = {
                    state: {
                        name: options.defaultItemState,
                        params: {
                            slug: wpItem.slug,
                        },
                    },
                };
            }

            const menuItem: Params.IMenuItem = {
                name: wpItem.title,
                type: type,
                class: wpItem.slug,
                params: params,
                wlcElement: wlcElement,
            };
            menuItems.push(menuItem);
        });
        return menuItems;
    }

    /**
     * Get base path for href menu item by params (url, lang, page)
     *
     * @param {IGetHrefItemBasePath} options Options for generate base path for href
     * @returns {string} Base path for href item of menu
     */
    public static getHrefItemBasePath(options: IGetHrefItemBasePath): string {
        let basePath = options.url;

        if (!basePath.endsWith('/')) {
            basePath += '/';
        }
        if (options.lang) {
            basePath += options.lang + '/';
        }
        if (options.page) {
            basePath += options.page + '/';
        }
        return basePath;
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
        const iconsFallback: string = options?.icons?.fallback;

        return _map(config, (configMenuItem: MenuConfigItem) => {
            if (_isString(configMenuItem)) {
                const menuItem: Params.IMenuItem = _cloneDeep(globalItemsConfig[configMenuItem]);
                MenuHelper.setIcon(menuItem, iconsFolder, disableIcons, iconsFallback);
                return menuItem;
            } else {
                if (_has(configMenuItem, 'parent')) {
                    const item = configMenuItem as MenuConfigItemsGroup;
                    const parent: Params.IMenuItem = _isObject(item.parent)
                        ? item.parent
                        : _cloneDeep(globalItemsConfig[item.parent]);
                    MenuHelper.setIcon(parent, iconsFolder, disableIcons, iconsFallback);

                    const items: MenuItemObjectType[] = item.items?.map((item: MenuItemsGroupItem) => {
                        if (_has(item, 'parent')) {
                            const dropdownItems = MenuHelper.parseMenuConfig(
                                (item as MenuConfigItemsGroup).items,
                                globalItemsConfig,
                                options,
                            );
                            return {
                                parent: item['parent'],
                                items: dropdownItems,
                            };
                        }

                        const itemData: Params.IMenuItem = _isObject(item)
                            ? _cloneDeep(item) as Params.IMenuItem
                            : _cloneDeep(globalItemsConfig[item]);
                        MenuHelper.setIcon(itemData, iconsFolder, disableIcons, iconsFallback);
                        return itemData;
                    }) || [];

                    return {
                        parent: parent,
                        items: items,
                        type: 'group',
                    };
                } else {
                    const item: Params.IMenuItem = _cloneDeep(configMenuItem as Params.IMenuItem);
                    MenuHelper.setIcon(item, iconsFolder, disableIcons, iconsFallback);
                    return item;
                }
            }
        });
    }

    /**
     * Set icon for menu item
     *
     * @param {IMenuItem} item Menu item
     * @param {string} iconsFolder Icon folder
     * @param {boolean} disable Disable use of icon
     * @param {string} fallback Fallback icon if the main one cannot be loaded
     */
    public static setIcon(item: Params.IMenuItem, iconsFolder: string, disable: boolean, fallback?: string): void {
        if (item) {
            if (disable) {
                item.icon = '';
                item.iconUrl = '';
            } else if (item.icon && iconsFolder) {
                item.icon = `${iconsFolder}/${item.icon}`;

                if (fallback) {
                    item.iconFallback = `${iconsFolder}/${fallback}`;
                }
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
    public static parseMenuSettings(
        settings: IMenuOptions,
        type: MenuType,
        lang: string,
        options: IParseSettingsOptions,
    ): MenuConfigItem[] {
        return MenuHelper.geiItemsByMenuSettings(settings.items, type, lang, options);
    }

    /**
     * Set settings for show correcty category buttons
     *
     * @param {MenuItemType[]} items Menu items
     * @param {ICategoryMenuCParams} categoryParams Category menu params
     */
    public static configureCategories(items: MenuItemType[], categoryParams: ICategoryMenuCParams): void {
        _forEach(items, (item: MenuItemType): void => {
            if (_isObject(item)) {
                const menuItem: MenuItemObjectType = item as MenuItemObjectType;
                if (menuItem.type === 'categories') {
                    (item as Params.IMenuItem).params = {
                        categories: {
                            componentParams: categoryParams,
                        },
                    };
                } else if (menuItem.type === 'group') {
                    this.configureCategories((item as Params.IMenuItemsGroup).items, categoryParams);
                }
            }
        });
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
    protected static geiItemsByMenuSettings(
        items: IMenuItem[],
        type: MenuType,
        lang: string,
        options: IParseSettingsOptions,
    ): MenuConfigItem[] {

        const specialCategories: string[] = ['favourites', 'lastplayed'];

        return _reduce(_orderBy(items, 'order', 'asc'), (items: MenuConfigItem[], item: IMenuItem) => {

            if (item.type === 'dropdown') {
                const dropdownItems: MenuConfigItem[] =
                    MenuHelper.geiItemsByMenuSettings(item.items, type, lang, options);
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
                        _set(menuItem, 'parent', parentItem);
                    } else {
                        if (item.iconUrl) {
                            if (_get(menuItem, 'icon')) {
                                delete (menuItem as Params.IMenuItem).icon;
                            }
                            _set(menuItem, 'iconUrl', item.iconUrl);
                        }
                        _set(menuItem, 'device', item.device || 'all');
                    }
                    items.push(menuItem);
                }

            } else if (item.type === 'category') {
                const auth: boolean | undefined = _includes(specialCategories, item.id) ? true : undefined;
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
                    auth: auth,
                    wlcElement: wlcElement,
                };
                items.push(menuItem);
            }
            return items;
        }, []);
    }
}

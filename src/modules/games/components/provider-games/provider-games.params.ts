import {
    IComponentParams,
    CustomType,
    TIconColorBg,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export type ComponentTheme = 'default' | 'mobile-app' | CustomType;
export type ComponentType = 'default' | 'mobile-app' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

/**
 * Globally set preferences in modules config
 * @example
 * const $modules = {
 *  games: {
 *      components: {
 *          'wlc-provider-games': {
 *              iconType: 'color',
 *              colorIconBg: 'dark',
 *          }
 *      }
 *  }
 * }
 */

export interface IProviderGamesCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    gamesGridCategoryParams?: IGamesGridCParams;
    gamesGridAllParams?: IGamesGridCParams;
    iconType?: 'color' | 'black';
    /** Apply one of two types of colored icons (works only with colored) */
    colorIconBg?: TIconColorBg;
};

export const defaultParams: IProviderGamesCParams = {
    class: 'wlc-provider-games',
    componentName: 'wlc-provider-games',
    moduleName: 'games',
    gamesGridCategoryParams: {
        usePlaceholders: true,
        gamesRows: 2,
        byState: false,
        hideEmpty: true,
        showProgressBar: true,
        moreBtn: {
            hide: false,
            lazy: false,
            lazyTimeout: 1000,
            scrollToEnd: false,
        },
    },
    gamesGridAllParams: {
        usePlaceholders: true,
        gamesRows: 2,
        byState: false,
        showProgressBar: true,
        title: gettext('All Games'),
        moreBtn: {
            hide: false,
            lazy: false,
            lazyTimeout: 1000,
            scrollToEnd: false,
        },
    },
    iconType: 'black',
};

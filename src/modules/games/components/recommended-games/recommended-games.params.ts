import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;

export interface IRecommendedGamesCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Component title */
    title?: string;
    dontShowCheckbox?: {
        text?: string,
    },
    /**
     * Params of wlc-games-grid component who shows Recommended games
     */
    gamesGridParams?: IGamesGridCParams;
}

export const defaultParams: IRecommendedGamesCParams = {
    moduleName: 'games',
    componentName: 'wlc-recommended-games',
    class: 'wlc-recommended-games',
    title: gettext('Other similar games for you'),
    dontShowCheckbox: {
        text: gettext('Don\'t show again'),
    },
    gamesGridParams: {
        theme: 'default',
        type: 'default',
        usePlaceholders: true,
        gamesRows: 2,
        showTitle: false,
        moreBtn: {
            hide: true,
        },
        showAllLink: {
            use: false,
        },
        breakpoints: {
            720: {
                gamesRows: 1,
            },
        },
        openContext: 'zing-pop-up-similar-games',
    },
};

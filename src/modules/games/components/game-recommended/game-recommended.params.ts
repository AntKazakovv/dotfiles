import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | 'wolf' | CustomType;

export interface IGameRecommendedCParams extends IComponentParams<Theme, Type, ThemeMod> {
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

export const defaultParams: IGameRecommendedCParams = {
    moduleName: 'games',
    componentName: 'wlc-game-recommended',
    class: 'wlc-game-recommended',
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
    },
};

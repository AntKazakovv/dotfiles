import {CountUpOptions} from 'countup.js';

import {
    IComponentParams,
    CustomType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ILocalJackpotsCParams extends IComponentParams<Theme, Type, ThemeMod> {
    gamesGridParams?: IGamesGridCParams;
    countUpOptions?: CountUpOptions;
    animateOnClick?: boolean;
    noDataText?: string;
    noDataTitle?: string;
    noDataImgPath?: string;
    noDataButton?: {
        state?: string;
        params?: IIndexing<string>;
    }
    userCurrency?: string;
}

export const defaultParams: ILocalJackpotsCParams = {
    moduleName: 'local-jackpots',
    componentName: 'wlc-local-jackpots',
    class: 'wlc-local-jackpots',
    userCurrency: 'EUR',
    gamesGridParams: {
        gamesRows: 2,
        showProgressBar: true,
    },
    animateOnClick: false,
    countUpOptions: {
        separator: ' ',
    },
    noDataText: gettext(
        'Oh, all the available jackpots have been played. New jackpots' +
        ' will appear later. In the meantime, we offer you to have a look at our new games.',
    ),
    noDataTitle: gettext('Jackpots'),
    noDataImgPath: 'wlc/jackpots/local-jackpot-money.png',
    noDataButton: {
        state: 'app.catalog.child',
        params: {
            category: 'casino',
            childCategory: 'new',
        },
    },
};

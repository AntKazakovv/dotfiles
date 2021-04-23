import {IIndexing} from 'wlc-engine/modules/core';
import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces';
import {ITournamentGames} from 'wlc-engine/modules/tournaments';

export type GGType = 'default' | 'search';

//TODO remove this interface after fix in GamesGrid configuration in project layouts
export interface IGamesFilterEasy {
    category?: string;
}

export interface IGamesGridCParams extends IComponentParams<string, GGType, string> {
    gamesRows: number;
    filter?: IGamesFilterData | IGamesFilterEasy;
    byState?: boolean;
    title?: string;
    usePlaceholders: boolean;
    showTitle?: boolean;
    titleIcon?: {
        name?: string,
        byCategory?: boolean;
        folder?: string;
    };
    tournamentGamesFilter?: ITournamentGames;
    titleIconByCategory?: boolean;
    showAllLink?: {
        use?: boolean;
        useCounter?: boolean;
        link?: string;
        params?: IIndexing<string>;
        text?: string;
    };
    moreBtn?: {
        hide?: boolean;
        lazy?: boolean;
        lazyTimeout?: number;
        scrollToEnd?: boolean;
    };
    hideOnEmptySearch?: boolean;
    searchFilterName?: string; // search param searchFrom must has the same name
    mobileSettings?: {
        showLoadButton?: boolean;
        gamesRows?: number;
    };
    hideEmpty?: boolean;
    showProgressBar?: boolean;
    thumbParams?: string,
}

export const defaultParams: IGamesGridCParams = {
    class: 'wlc-games-grid',
    gamesRows: 4,
    usePlaceholders: true,
    showTitle: true,
    showAllLink: {
        use: false,
    },
    moreBtn: {
        hide: false,
        lazy: false,
        lazyTimeout: 1000,
        scrollToEnd: true,
    },
};

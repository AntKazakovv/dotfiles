import {IIndexing} from 'wlc-engine/modules/core';
import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITournamentGames} from 'wlc-engine/modules/tournaments';

export type GGType = 'default' | 'search';

export interface IGamesGridCParams extends IComponentParams<string, GGType, string> {
    gamesRows: number;
    filter?: {
        category: string;
    };
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
    };
    hideOnEmptySearch?: boolean;
    searchFilterName?: string; // search param searchFrom must has the same name
    mobileSettings?: {
        showLoadButton?: boolean;
        gamesRows?: number;
    };
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
    },
};

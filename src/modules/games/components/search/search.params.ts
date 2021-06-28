import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export interface IGamesGridCParamsPartial extends IGamesGridCParams {
    type: never,
    byState: never,
    showAllLink: never,
    searchFilterName: never,
};

export interface ISearchCParams extends IComponentParams<string, string, string> {
    common?: {
        gamesGridParams?: IGamesGridCParamsPartial;
        openProvidersList?: boolean,
    }
};

export type PanelType = 'merchants' | 'categories';

export const defaultParams: ISearchCParams = {
    class: 'wlc-search',
    common: {
        openProvidersList: false,
    },
};

export const defaultGamesGridParams: IGamesGridCParams = {
    type: 'search',
    searchFilterName: 'modal',
    gamesRows: 3,
    usePlaceholders: false,
    byState: true,
    moreBtn: {
        hide: false,
        lazy: false,
    },
    breakpoints: {
        375 : {
            gamesRows: 2,
        },
        1630 : {
            gamesRows: 3,
        },
    },
};

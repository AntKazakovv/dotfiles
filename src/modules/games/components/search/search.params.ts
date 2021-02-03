import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export interface IGamesGridCParamsPartial extends IGamesGridCParams {
    type: never,
    byState: never,
    showAllLink: never,
    hideOnEmptySearch: never,
    searchFilterName: never,
};

export interface ISearchCParams extends IComponentParams<string, string, string> {
    gamesGridParams?: IGamesGridCParamsPartial;
};

export type PanelType = 'merchants' | 'categories';

export const defaultParams: ISearchCParams = {
    class: 'wlc-search',
};

export const defaultGamesGridParams: IGamesGridCParams = {
    type: 'search',
    searchFilterName: 'modal',
    gamesRows: 3,
    usePlaceholders: false,
    filter: undefined,
    moreBtn: {
        hide: false,
        lazy: false,
    },
};

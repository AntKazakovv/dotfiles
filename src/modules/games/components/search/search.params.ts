import {IComponentParams} from 'wlc-engine/interfaces/config.interface';
import {IGamesGridCParams} from 'wlc-engine/modules/games/components/games-grid/games-grid.params';

export interface IGamesGridCParamsPartial extends IGamesGridCParams {
    type: never,
    byState: never,
    showAllLink: never,
    hideOnEmptySearch: never,
    searchFilterName: never,
};

export interface ISearchParams extends IComponentParams<string, string, string> {
    gamesGridParams?: IGamesGridCParamsPartial;
};

export type PanelType = 'merchants' | 'categories';

export const defaultParams: ISearchParams = {
    class: 'wlc-search',
};

export const defaultGamesGridParams: IGamesGridCParams = {
    type: 'search',
    searchFilterName: 'modal',
    gamesRows: 2,
    usePlaceholders: false,
    filter: undefined,
    moreBtn: {
        hide: false,
        lazy: false,
    },
};

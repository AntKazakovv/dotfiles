import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';

export type ComponentType = 'default' | CustomType;
export type ComponentTheme = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ISearchResultEasyCParams extends
    IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
        emptyText?: string,
        gamesGridParams?: IGamesGridCParams,
        secondGamesGridParams?: IGamesGridCParams
}

export const defaultParams: ISearchResultEasyCParams = {
    moduleName: 'games',
    class: 'wlc-search-result-easy',
    componentName: 'search-result-easy',
    theme: 'default',
};


import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {ICategory} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

export type IGamesFilterData = {
    ids?: number[] | null;
    searchQuery?: string | null;
    categories?: string[];
    category?: string;
    merchants?: number[];
    excludeCategories?: string[];
    excludeMerchants?: number[];
    withFreeRounds?: boolean;
    name?: string,
    byCategory?: boolean;
    folder?: string;
    fallback?: string;
    /**
     * Game search should include sportsbooks if true.
     * Otherwise, the search will be performed on regular games
     */
    includeSportsbooks?: boolean;
    /**
     * Filter games by parent category. Use with categories.
     */
    parentCategory?: string;
}

export type TFilterCacheKeys = 'modal' | string;

export type IIndexingFilter = {
    [key: string]: IGamesFilterData;
}

export type IGamesFilterServiceEvents = {
    FILTER_CHANGED: string;
    FILTER_SEARCH: string;
    FILTER_SORT: string;
}

export type ICategoryOptions = {
    excludeCategories?: string[];
    includeOnly?: string[];
}

export type categoryMenuItemNameType = string | IIndexing<string>;

export enum CategoryVisibility {
    Authenticated = 'authenticated',
    Anonymous = 'anonimous'
}
export interface ICategoryMenuItem extends ICategory {
    id?: string;
    filters?: IGamesFilterData;
    lastPlayed?: boolean;
    favourites?: boolean;
    recommendations?: boolean;
    default?: boolean;
}

export type TGamesFilterMod = 'exclude' | 'include';

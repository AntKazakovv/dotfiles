
import {IIndexing} from 'wlc-engine/interfaces';
import {ICategory} from 'wlc-engine/modules/games/interfaces/games.interfaces';

export type IGamesFilterData = {
    categories?: string[];
    merchants?: string[];
    excludeCategories?: string[];
    excludeMerchants?: string[];
}

export type IIndexingFilter = {
    [key: string]: IGamesFilterData;
}

export type IGamesFilterServiceEvents = {
    FILTER_CHANGED: string;
    FILTER_SEARCH: string;
    FILTER_SORT: string;
    FILTER_MERCHANT: string;
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
    default?: boolean;
}

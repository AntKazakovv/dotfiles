import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type SearchFieldFromType = 'modal' | 'page' | string;

export interface ISearchFieldCParams extends IComponentParams<string, string, string> {
    /**
     * Search query loaded from cache
     */
    searchQueryFromCache?: string;
    searchFrom: SearchFieldFromType;
    placeholder?: string;
    focus?: boolean;
    /**
     * debounceTime before search input event will be pushed
     */
    debounceTime?: number;
};

export const defaultParams: ISearchFieldCParams = {
    class: 'wlc-search-field',
    placeholder: 'Search for games',
    searchQueryFromCache: '',
    searchFrom: 'page',
    focus: false,
    debounceTime: 500,
};

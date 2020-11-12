import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export type SearchFieldFromType = 'modal' | 'page' | string;

export interface ISearchFieldCParams extends IComponentParams<string, string, string> {
    searchFrom: SearchFieldFromType;
    placeholder?: string;
};

export const defaultParams: ISearchFieldCParams = {
    class: 'wlc-search-field',
    placeholder: 'Search game',
    searchFrom: 'page',
};

import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export type SearchFieldFromType = 'modal' | 'page' | string;

export interface ISearchFieldCParams extends IComponentParams<string, string, string> {
    searchFrom: SearchFieldFromType;
    placeholder?: string;
    focus?: boolean;
};

export const defaultParams: ISearchFieldCParams = {
    class: 'wlc-search-field',
    placeholder: 'Search for games',
    searchFrom: 'page',
    focus: false,
};

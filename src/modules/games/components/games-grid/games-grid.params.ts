import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type GGType = 'default' | 'search';
export interface IGamesGridCParams extends IComponentParams<string, GGType, string> {
    gamesRows: number;
    filter?: {
        category: string;
    };
    byState?: boolean;
    title?: string;
    usePlaceholders: boolean;
    showAllLink?: {
        use?:boolean;
        link?: string;
    };
    moreBtn?: {
        hide?: boolean;
        lazy?: boolean;
        lazyTimeout?: number;
    };
    hideOnEmptySearch?: boolean;
    searchFilterName?: string; // search param searchFrom must has the same name
}

export const defaultParams: IGamesGridCParams = {
    class: 'wlc-games-grid',
    gamesRows: 4,
    usePlaceholders: true,
    showAllLink: {
        use: false,
    },
    moreBtn: {
        hide: false,
        lazy: false,
        lazyTimeout: 1000,
    },
};

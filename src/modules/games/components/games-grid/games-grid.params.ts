import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export interface IGGParams extends IComponentParams<string, string, string> {
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
}

export const defaultParams: IGGParams = {
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

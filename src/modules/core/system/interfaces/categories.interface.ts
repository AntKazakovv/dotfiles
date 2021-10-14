import {IIndexing} from 'wlc-engine/modules/core';

export type CategoryViewType = 'all-games' | 'blocks' | 'restricted-blocks';
export type CategoryBlockShowType = 'slide-arrows' | 'btn-load-more';

export interface ICategorySettings {
    view: CategoryViewType,
    blocks?: IIndexing<ICategoryBlock>;
}

export interface ICategoryBlock {
    order: number;
    showType: CategoryBlockShowType;
    gameRows?: {
        desktop?: number;
        mobile?: number;
    };
    disable?: boolean;
}

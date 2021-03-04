import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ICategoryPreviewCParams extends IComponentParams<Theme, Type, ThemeMod> {
    categories?: string[];
    categoriesCount?: number;
}

export const defaultParams: ICategoryPreviewCParams = {
    class: 'wlc-category-preview',
    categories: ['popular', 'livecasino', 'blackjacks'],
    categoriesCount: 3,
};

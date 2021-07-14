import {CustomType, IComponentParams} from 'wlc-engine/modules/core';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IPaginationCParams extends IComponentParams<ComponentTheme, ComponentType, ThemeMod> {
}
export interface IPaginationBreakepoint {
    [key: number]: {
        itemPerPage: number;
    }
}
export interface IPagination {
    use: boolean;
    breakpoints: IPaginationBreakepoint | null;
}

export interface IPaginateOutput {
    paginatedItems: unknown[],
    itemsPerPage: number,
}

export const defaultParams: IPaginationCParams = {
    class: 'wlc-pagination',
};

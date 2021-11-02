import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export interface IHistoryNameItem {
    name: string;
    status: string;
    id: string;
};

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IHistoryNameParams extends IComponentParams<Theme, Type, ThemeMod> {
    item?: IHistoryNameItem;
}

export const defaultParams: IHistoryNameParams = {
    class: 'wlc-history-name',
};

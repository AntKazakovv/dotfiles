import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {BehaviorSubject} from 'rxjs';

export type Theme = 'default' | 'tournaments' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type TableColType = 'text' | 'date' | 'index' | 'amount' | 'component';

export interface ITableCommonParams {
    indexShift?: number;
    noItemsText?: string;
}

export interface ITableCParams extends IComponentParams<Theme, Type, ThemeMod>, ITableCommonParams {
    head?: ITableCol[],
    rows?: unknown[] | BehaviorSubject<unknown[]>,
    pageCount?: number
}

export const defaultParams: ITableCParams = {
    class: 'wlc-table',
    noItemsText: gettext('No items available'),
    pageCount: 10,
};

export interface ITableCol {
    key: string;
    title: string;
    type: TableColType;
    format?: string;
    order?: number;
    mapValue?: (v: unknown, index?: number) => unknown;
    component?: string;
    componentClass?: unknown;
    disableHideClass?: boolean;
    wlcElement?: string;
}

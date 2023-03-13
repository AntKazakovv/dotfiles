import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {IPagination} from 'wlc-engine/modules/core/components/pagination/pagination.params';

export type Theme = 'default' | 'tournaments' | 'mobile-app' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | 'first' | CustomType;
export type TableColType = 'text' | 'date' | 'index' | 'amount' | 'component';


export interface ITableCParams extends IComponentParams<Theme, Type, ThemeMod> {
    head?: ITableCol[],
    rows?: unknown[] | BehaviorSubject<unknown[]>,
    pageCount?: number,
    pagination?: IPagination,
    iconPath?: string,
    switchWidth?: number;
    indexShift?: number;
}

export const defaultParams: ITableCParams = {
    class: 'wlc-table',
    pageCount: 10,
    pagination: {
        use: true,
        breakpoints: {
            0: {
                itemPerPage: 10,
            },
        },
    },
    switchWidth: 1024,
    iconPath: '/wlc/icons/empty-table-bg.svg',
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
    description?: string,
}

import {Injector} from '@angular/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import * as Params from './table.params';

import {
    get as _get,
    isString as _isString,
} from 'lodash-es';

export class TableRowModel {

    public opened: boolean = false;
    public paramsInjector: IIndexing<Injector> = {};

    constructor(
        private data: unknown,
        private params: Params.ITableCommonParams,
    )
    {
    }

    public getValue(col: Params.ITableCol, index?: number): string {

        switch (col.type) {

            case 'index':
                return (typeof index !== undefined) ? (index + (this.params.indexShift || 1)) + '' : '';

            case 'date':
                const value = _get(this.data, col.key);
                if (_isString(value)) {
                    return value;
                } else {
                    return (col.format ? value?.toFormat(col.format) : value?.toFormat('dd-MM-yyyy HH:mm:ss')) || value.toString();
                }

            default:
                return col.mapValue ? col.mapValue(this.data) : _get(this.data, col.key);
        }
    }

    public toggleRow(): void {
        this.opened = !this.opened;
    }
}

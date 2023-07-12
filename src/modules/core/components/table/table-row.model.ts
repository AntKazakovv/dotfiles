import {Injector} from '@angular/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import * as Params from './table.params';

import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';

export type Currency = {
    value: string;
    currency: string;
}

export class TableRowModel {

    public opened: boolean = false;
    public paramsInjector: IIndexing<Injector> = {};

    constructor(
        private data: unknown,
        private params: Params.ITableCParams,
    ) {
    }

    public getValue(col: Params.ITableCol, index?: number): string | Currency {
        const value = _get(this.data, col.key);
        let defaultValue: string | Currency = col.mapValue ? col.mapValue(this.data, index) : value;

        switch (col.type) {

            case 'index':
                return (typeof index !== undefined) ? (index + (this.params.indexShift || 1)) + '' : '';

            case 'date':
                if (_isString(value)) {
                    return value;
                } else {
                    return (
                        col.format
                            ? value?.toFormat(col.format)
                            : value?.toFormat('dd-MM-yyyy HH:mm:ss')
                    ) || value?.toString();
                }

            case 'component':
                const currency = _get(this.data, 'currency') ?? _get(this.data, 'Currency');
                if (col.component === 'core.wlc-currency' && currency) {
                    defaultValue = {
                        value: <string>defaultValue,
                        currency: currency,
                    };
                }

            default:
                return defaultValue;
        }
    }

    public toggleRow(): void {
        this.opened = !this.opened;
    }
}

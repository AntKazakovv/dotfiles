import {Injector} from '@angular/core';

import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';

import * as Params from './table.params';

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

    public getValue(col: Params.ITableCol, index?: number): string | Currency | IWrapperCParams {
        const value = _get(this.data, col.key);
        let defaultValue: string | Currency | IWrapperCParams = col.mapValue ? col.mapValue(this.data, index) : value;

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

                if (col.component === 'core.wlc-wrapper' && currency && col.currencyUseIcon) {
                    defaultValue = {
                        class: 'wlc-currency-wrapper',
                        components: [
                            {
                                name: 'core.wlc-currency',
                                params: {
                                    value: <string>defaultValue,
                                    showValueOnly: true,
                                },
                            },
                            {
                                name: 'core.wlc-icon',
                                params: {
                                    iconPath: this.getIconUrl(currency),
                                },
                            },
                        ],
                    };
                }
                if (col.component === 'core.wlc-currency' && currency) {
                    defaultValue = {
                        value: <string>defaultValue,
                        currency: currency,
                    };
                    if (col.currencyUseIcon) {
                        defaultValue = {
                            class: 'wlc-currency-wrapper',
                        };
                    }
                }

            default:
                return defaultValue;
        }
    }

    public toggleRow(): void {
        this.opened = !this.opened;
    }

    public getIconUrl(currency: string): string {
        return `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
    }
}

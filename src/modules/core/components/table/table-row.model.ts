import {Injector} from '@angular/core';

import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _toString from 'lodash-es/toString';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';

import * as Params from './table.params';

export type Currency = {
    value: string;
    currency: string;
}

export type TTableValue = string | Currency | IWrapperCParams;

export class TableRowModel {

    public opened: boolean = false;
    public paramsInjector: IIndexing<Injector> = {};

    constructor(
        private data: unknown,
        private params: Params.ITableCParams,
    ) {
    }

    public getValue(col: Params.ITableCol, index?: number): TTableValue {
        const value = _get(this.data, col.key);
        let defaultValue: TTableValue = col.mapValue ? col.mapValue(this.data, index) : value;

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
                                    currency: WalletHelper.conversionCurrency ?? currency,
                                    showValueOnly: !WalletHelper.conversionCurrency,
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

    public getAmount(col: Params.ITableCol): string {
        return _toString(_get(this.data, col.key));
    }

    public get description(): string {
        return  _get(this.data, 'description');
    }
}

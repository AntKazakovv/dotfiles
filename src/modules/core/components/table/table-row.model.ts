import {Injector} from '@angular/core';

import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _toString from 'lodash-es/toString';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {IWrapperCParams} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';
import {ICurrencyCParams} from 'wlc-engine/modules/core/components/currency/currency.params';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

import * as Params from './table.params';

export type Currency = {
    value: string;
    currency: string;
}

export type TTableValue = string | Currency | IWrapperCParams | ICurrencyCParams;

export class TableRowModel {
    public paramsInjector: IIndexing<Injector> = {};
    public id: unknown;

    constructor(
        protected readonly walletsService: WalletsService,
        private data: unknown,
        private params: Params.ITableCParams,
        public opened: boolean = false,
    ) {
        // @ts-ignore no-implicit-any #672571
        this.id = data?.['id'] ?? null;
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
                            ? value?.format(col.format)
                            : value?.format('DD-MM-YYYY HH:mm:ss')
                    ) || value?.toString();
                }

            case 'component':
                const currency = _get(this.data, 'currency') ?? _get(this.data, 'Currency');

                if (col.component === 'core.wlc-currency' && currency) {

                    if (col.useCurrencyIcon) {

                        return defaultValue = {
                            value: <string>defaultValue,
                            currency: this.walletsService?.conversionCurrency ?? currency,
                            showValueOnly: !this.walletsService?.conversionCurrency,
                            useCurrencyIcon: true,
                        };
                    }

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

    public getIconUrl(currency: string): string {
        return `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
    }

    public getDefaultValue(col: Params.ITableCol): string {
        return _toString(_get(this.data, col.key));
    }

    public get description(): string {
        return  _get(this.data, 'description');
    }
}

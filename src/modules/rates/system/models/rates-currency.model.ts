import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IRatesCurrency,
    ICoupleCurrency,
} from 'wlc-engine/modules/rates/system/interfaces/rates.interfaces';

export class RateCurrencyModel extends AbstractModel<IRatesCurrency> {
    private coupleCurrency;

    constructor(
        data: IRatesCurrency,
        coupleCurrency: ICoupleCurrency,
        from?: IFromLog,
    ) {
        super({from: _assign({model: 'RateCurrencyModel'}, from)});
        this.data = data;
        this.coupleCurrency = coupleCurrency;
    }

    /**
     * cryptoCurrency name
     * @returns {string}
     */
    public get cryptoCurrency(): string {
        return this.coupleCurrency.cryptoCurrency;
    }

    /**
     * fiat name
     * @returns {string}
     */
    public get currency(): string {
        return this.coupleCurrency.currency;
    }

    /**
     * rate of currency
     * @returns {number}
     */
    public get rate(): number {
        return  _toNumber(this.data.rate);
    }
}

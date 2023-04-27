import {Injectable} from '@angular/core';
import {
    DataService,
    IData,
    LogService,
} from 'wlc-engine/modules/core';

import {IRatesCurrency} from 'wlc-engine/modules/rates/system/interfaces';
import {RateCurrencyModel} from 'wlc-engine/modules/rates/system/models/rates-currency.model';

@Injectable()
export class RatesCurrencyService {

    constructor(
        private dataService: DataService,
        protected logService: LogService,
    ) {}

    public async getRateCurrency(cryptoCurrency: string, currency: string): Promise<RateCurrencyModel> {
        try {
            const cryptoLow = cryptoCurrency.toLocaleLowerCase();
            const currencyLow = currency.toLocaleLowerCase();
            const url = `/paycryptos/currency/rate/${cryptoLow}_${currencyLow}`;
            const response: IData<IRatesCurrency> = await this.dataService.request({
                name: 'rates',
                system: 'paycryptos',
                url: url,
                type: 'GET',
            });
            return new RateCurrencyModel(response.data, {cryptoCurrency, currency});
        } catch (error) {
            this.logService.sendLog({
                code: '26.0.0',
                data: error,
                from: {
                    service: 'RatesCurrencyService',
                    method: 'getRateCurrency',
                },
            });
        }
    }
}

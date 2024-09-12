import {inject, Injectable} from '@angular/core';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    InjectionService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {ICurrencyConversion} from 'wlc-engine/modules/multi-wallet';
import {IRatesCurrency} from 'wlc-engine/modules/rates/system/interfaces';
import {RateCurrencyModel} from 'wlc-engine/modules/rates/system/models/rates-currency.model';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

@Injectable({
    providedIn: 'root',
})
export class RatesCurrencyService {
    public walletsService: WalletsService;

    protected readonly configService: ConfigService = inject(ConfigService);

    constructor(
        protected logService: LogService,
        protected injectionService: InjectionService,
        private dataService: DataService,
        private eventService: EventService,
    ) {
        this.setMultiWallet();
    }

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

    public async getRate(body: ICurrencyConversion): Promise<number> {

        if (body.currencyFrom === body.currencyTo) {
            return 1;
        }

        const rate: number = this.walletsService?.rates[`${body.currencyFrom}->${body.currencyTo}`];

        if (rate) {
            return rate;
        } else {
            try {
                const response: IData<ICurrencyConversion> = await this.dataService.request({
                    name: 'getRate',
                    system: 'multi-wallet',
                    url: `/estimate?currencyFrom=${body.currencyFrom}&currencyTo=${body.currencyTo}`,
                    type: 'GET',
                });

                if (this.walletsService) {
                    this.walletsService.rates = {
                        ...this.walletsService.rates,
                        [`${body.currencyFrom}->${body.currencyTo}`]: response.data.estimatedAmount,
                    };
                }

                return response.data.estimatedAmount;

            } catch (error) {

                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: gettext('Currency conversion failed'),
                        message: error.errors ?? gettext('Something went wrong. Please try again later'),
                        wlcElement: 'notification_creating-wallet-error',
                    },
                });

                this.logService.sendLog({code: '23.0.1', data: error});
                return 1;
            }
        }

    }

    private async setMultiWallet(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet')) {
            this.walletsService = await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
        }
    }
}

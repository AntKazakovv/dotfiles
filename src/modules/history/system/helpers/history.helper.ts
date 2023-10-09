import _toString from 'lodash-es/toString';

import {InjectionService} from 'wlc-engine/modules/core';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';
import {Transaction} from 'wlc-engine/modules/history';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';

export class HistoryHelper {
    private static ratesService: RatesCurrencyService;

    public static async conversionCurrency<T extends Transaction | IBet>
    (
        injectionService: InjectionService,
        histories: T[],
    ): Promise<T[]> {

        if (WalletHelper.conversionCurrency) {

            histories = await Promise.all(histories.map(async (history: T): Promise<T> => {

                this.ratesService ??=
                    await injectionService.getService<RatesCurrencyService>('rates.rates-currency-service');

                if (history instanceof Transaction) {

                    const coefficient: number = await this.ratesService.getRate(
                        {
                            currencyFrom: history.currency,
                            currencyTo: WalletHelper.conversionCurrency,
                        },
                    );
                    history.currency = WalletHelper.conversionCurrency;
                    history.coefficientConvertion = coefficient;

                } else {
                    const coefficient: number = await this.ratesService.getRate(
                        {
                            currencyFrom: (<IBet>history).Currency,
                            currencyTo: WalletHelper.conversionCurrency,
                        },
                    );
                    history.Currency = WalletHelper.conversionCurrency;
                    history.Amount = _toString(+(<IBet>history).Amount * coefficient);
                }
                return history;
            }));
        }
        return histories;
    }
}

import _toString from 'lodash-es/toString';

import {InjectionService} from 'wlc-engine/modules/core';
import {Bet} from 'wlc-engine/modules/history/system/models/bet-history/bet-history.model';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';
import {Transaction} from 'wlc-engine/modules/history';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';

export class HistoryHelper {
    private static ratesService: RatesCurrencyService;

    public static async conversionCurrency<T extends Transaction | Bet>
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
                    history.coefficientConvertion = coefficient;

                } else {
                    const coefficient: number = await this.ratesService.getRate(
                        {
                            currencyFrom: (<Bet>history).currency,
                            currencyTo: WalletHelper.conversionCurrency,
                        },
                    );
                    history.currency = WalletHelper.conversionCurrency;
                    history.amount = _toString(+(<Bet>history).amount * coefficient);
                }
                return history;
            }));
        }
        return histories;
    }
}

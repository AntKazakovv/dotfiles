import _toString from 'lodash-es/toString';

import {InjectionService} from 'wlc-engine/modules/core';
import {Bet} from 'wlc-engine/modules/history/system/models/bet-history/bet-history.model';
import {Transaction} from 'wlc-engine/modules/history';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

export class HistoryHelper {
    protected static walletsService: WalletsService;

    private static ratesService: RatesCurrencyService;

    public static async conversionCurrency<T extends Transaction | Bet>
    (
        injectionService: InjectionService,
        histories: T[],
        isMultiWallet: boolean,
    ): Promise<T[]> {

        if (isMultiWallet) {
            HistoryHelper.walletsService ??=
                await injectionService.getService<WalletsService>('multi-wallet.wallet-service');
        }

        if (HistoryHelper.walletsService?.conversionCurrency) {
            histories = await Promise.all(histories.map(async (history: T): Promise<T> => {

                this.ratesService ??=
                    await injectionService.getService<RatesCurrencyService>('rates.rates-currency-service');

                if (history instanceof Transaction) {

                    const coefficient: number = await this.ratesService.getRate(
                        {
                            currencyFrom: history.currency,
                            currencyTo: HistoryHelper.walletsService.conversionCurrency,
                        },
                    );
                    history.coefficientConvertion = coefficient;

                } else {
                    const coefficient: number = await this.ratesService.getRate(
                        {
                            currencyFrom: (<Bet>history).currency,
                            currencyTo: HistoryHelper.walletsService.conversionCurrency,
                        },
                    );
                    history.currency = HistoryHelper.walletsService.conversionCurrency;
                    history.amount = _toString(+(<Bet>history).amount * coefficient);
                }
                return history;
            }));
        }
        return histories;
    }
}

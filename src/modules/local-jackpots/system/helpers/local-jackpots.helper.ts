import {JackpotCurrency} from 'wlc-engine/modules/core/constants';

export class LocalJackpotsHelper {

    public static userCurrencyFormat(currentLang: string, currency: string): string {
        return Intl.NumberFormat(currentLang, {
            style: 'currency',
            currency,
        }).format(0).replace(JackpotCurrency.formatCurrency, '');
    }
}

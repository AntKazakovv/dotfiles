import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface IRegistrationConfig {
    selectCurrencyByCountry?: IIndexing<string>;
    /**
     * Сurrencies for the country at registration
     * configuration
     *
     *  @example:
     *  registration: {
     *      regCurrenciesByCountries: {
     *          rus: ['RUB'],
     *          deu: ['EUR', 'RUB'],
     *          blr: ['EUR'],
     * },
     *  }
     */
    regCurrenciesByCountries?: IIndexing<string[]>;
    /**filter currency by geo (must have regCurrenciesByCountries)**/
    filterCurrencyByGeo?: boolean;
     /**filter currency by country when country has been selected (must have regCurrenciesByCountries)**/
    filterCurrencyByCountry?: boolean;
    /**
     * Currency sorting configuration
     *
     *  @example:
     *  registration: {
     *      currencySort: [
     *          'CAD',
     *          'USD',
     *          'RUB',
     *      ],
     *  }
     */
    currencySort?: string[],
    skipBonusStep?: boolean;
    /**
     * Use welcome-banner from fundist in signUp form
     *
     *  @example:
     *  registration: {
     *     usePromoBanner: true,
     *  }
     */
    usePromoBanner?: boolean;
}

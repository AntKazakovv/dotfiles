import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface IRegistrationConfig {
    selectCurrencyByCountry?: IIndexing<string>;
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
}

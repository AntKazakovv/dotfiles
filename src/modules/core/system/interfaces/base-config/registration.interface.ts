import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface IRegistrationConfig {
    selectCurrencyByCountry?: IIndexing<string>;
}

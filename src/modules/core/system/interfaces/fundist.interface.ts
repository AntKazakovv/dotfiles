import {IIndexing} from './global.interface';

export interface ICountry {
    phoneCode: string;
    title: string;
    value: string;
    iso2?: string;
    iso3?: string;
    /**
     * Path by country flag. Add field in selectValuesService if enable config
     */
    icon?: string;
}

export interface ICountries {
    countries: ICountry[];
    lang: string;
}

/**
 * 'All' (freerounds uses for all games) or array of some game ids
 */
export type TGamesWithFreeRounds = 'All' | number[];

/**
 * Freerounds settings by merchants (key is merchant name)
 */
export type TFreeRoundGames = '' | IIndexing<TGamesWithFreeRounds>;

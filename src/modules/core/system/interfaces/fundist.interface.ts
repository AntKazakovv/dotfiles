import {IIndexing} from './global.interface';

export interface ICountry {
    phoneCode: string;
    title: string;
    value: string;
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

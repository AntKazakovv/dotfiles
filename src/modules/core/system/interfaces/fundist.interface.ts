import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export interface ICountry {
    phoneCode: string | null;
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

export interface IStates {
    states: TStates;
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

export interface IState {
    value: string;
    title: string;
}

export type TStates  = IIndexing<IState[]>;

import _get from 'lodash-es/get';
import {GamesSortEnum} from 'wlc-engine/modules/games/system/interfaces/sorts.enums';

import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';

export const GamesSortOrder = [
    GamesSortEnum.LocalByCountries,
    GamesSortEnum.LocalByLanguages,
    GamesSortEnum.Local,

    GamesSortEnum.GlobalByCountries,
    GamesSortEnum.GlobalByLanguages,
    GamesSortEnum.Global,
] as const;

export const GamesInCategorySortOrder = [
    GamesSortEnum.LocalPerCategoriesByCountries,
    GamesSortEnum.LocalByCountries,
    GamesSortEnum.LocalByLanguages,
    GamesSortEnum.LocalByCategories,
    GamesSortEnum.Local,

    GamesSortEnum.GlobalPerCategoriesByCountries,
    GamesSortEnum.GlobalByCountries,
    GamesSortEnum.GlobalByLanguages,
    GamesSortEnum.GlobalByCategories,
    GamesSortEnum.Global,
] as const;


const categoryThenCountryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    country: string,
    _language: string,
    categoryId?: number,
): string | number | undefined => _get(sort, [rank, categoryId, country]);

const countryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    country: string,
): string | number | undefined => _get(sort, [rank, country]);

const languageGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    _country: string,
    language: string,
): string | number | undefined => _get(sort, [rank, language]);

const categoryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    _country: string,
    _language: string,
    categoryId: number,
): string | number | undefined => _get(sort, [rank, categoryId]);

const defaultGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
): string | number | undefined => _get(sort, rank);



export const sortGetters: Record<keyof Omit<IAllSortsItemResponse, 'ID'>, typeof categoryThenCountryGetter> = {
    [GamesSortEnum.LocalPerCategoriesByCountries]: categoryThenCountryGetter,
    [GamesSortEnum.LocalByCountries]: countryGetter,
    [GamesSortEnum.LocalByLanguages]: languageGetter,
    [GamesSortEnum.LocalByCategories]: categoryGetter,
    [GamesSortEnum.Local]: defaultGetter,

    [GamesSortEnum.GlobalPerCategoriesByCountries]: categoryThenCountryGetter,
    [GamesSortEnum.GlobalByCountries]: countryGetter,
    [GamesSortEnum.GlobalByLanguages]: languageGetter,
    [GamesSortEnum.GlobalByCategories]: categoryGetter,
    [GamesSortEnum.Global]: defaultGetter,
};

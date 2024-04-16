import _get from 'lodash-es/get';

import {GamesSortEnum} from 'wlc-engine/modules/games/system/interfaces/sorts.enums';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';

/**
 * Games sort types and their order when apply sort games globaly
 */
export const GamesSortOrder = [
    GamesSortEnum.LocalByCountries,
    GamesSortEnum.LocalByLanguages,
    GamesSortEnum.Local,

    GamesSortEnum.GlobalByCountries,
    GamesSortEnum.GlobalByLanguages,
    GamesSortEnum.Global,
] as const;

/**
 * Games sort types and their order when apply sort games in some category
 */
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

function numSortValue(value: string | number): number | null {
    return value ? Number(value) : null;
}

const categoryThenCountryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    country: string,
    _language: string,
    categoryId?: number,
): number | null => {
    return numSortValue(_get(sort, [rank, categoryId, country]));
};

const countryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    country: string,
): number | null => {
    return numSortValue(_get(sort, [rank, country]));
};

const languageGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    _country: string,
    language: string,
): number | null => {
    return numSortValue(_get(sort, [rank, language]));
};

const categoryGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
    _country: string,
    _language: string,
    categoryId: number,
): number | null => {
    return numSortValue(_get(sort, [rank, categoryId]));
};

const defaultGetter = (
    sort: Partial<IAllSortsItemResponse>,
    rank: GamesSortEnum,
): number | null => {
    return numSortValue(_get(sort, rank) as unknown as number);
};

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

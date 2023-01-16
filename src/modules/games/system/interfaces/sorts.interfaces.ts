
import {TMustHaveKeys, TSortDirection} from 'wlc-engine/modules/core';
import {GamesSortEnum} from 'wlc-engine/modules/games/system/interfaces/sorts.enums';

export interface IAllSortsItemResponse {
    ID: string;

    localPerCategoriesByCountries: {[categoryId: number]: {[countryCode: string]: number}};
    localByCountries: {[countryCode: string]: number};
    localByLanguages: {[languageCode: string]: number};
    localByCategories: {[categoryId: number]: number};
    local: string | null;

    globalPerCategoriesByCountries: {[categoryId: number]: {[countryCode: string]: number}};
    globalByCountries: {[countryCode: string]: number};
    globalByLanguages: {[languageCode: string]: number};
    globalByCategories: {[categoryId: number]: number};
    global: string;
}

export type TGamesSortResponses = TMustHaveKeys<Record<GamesSortEnum, any>, {
    all: IAllSortsItemResponse[];
    auto: {[id: number]: {[categoryId: number]: number}};

    global: {[id: number]: number};
    globalByCategories: {[id: number]: {[categoryId: number]: number}};
    globalByCountries: {[id: number]: {[countryCode: number]: number}};
    globalByLanguages: {[id: number]: {[languageCode: string]: number}};
    globalPerCategoriesByCountries: {[categoryId: number]: {[id: number]: {[countryCode: number]: number}}};

    local: {[id: number]: string};
    localByCategories: {[id: number]: {[categoryId: number]: number}};
    localByCountries: {[id: number]: {[countryCode: number]: number}};
    localByLanguages: {[id: number]: {[languageCode: string]: number}};
    localPerCategoriesByCountries: {[categoryId: number]: {[id: number]: {[countryCode: number]: number}}};
}>;

export type TGamesSortDirections = Record<keyof Omit<IAllSortsItemResponse, 'ID'>, TSortDirection>;

export type TAutoGamesSortResponse = Pick<TGamesSortResponses, GamesSortEnum.Auto>;

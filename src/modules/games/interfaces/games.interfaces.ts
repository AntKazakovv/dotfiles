import {IIndexingString, IIndexingBoolean, IIndexing} from 'wlc-engine/interfaces/index';
import {Game} from 'wlc-engine/modules/games/models/game.model';

/**
 * TYPES
 */
export type IMerchants = {
    [key: number]: IMerchant;
}

export type ICountriesRestrictions = {
    [key: string]: ICountriesRestriction;
}

export type IMerchant = {
    Alias: string;
    ID: string | number;
    Image: string;
    Name: string;
    menuId: string;
    IDParent: string | null;
}

export type ICountriesRestriction = {
    Countries: string[];
    ID: string;
    IDMerchant: string;
    IDParent: string;
    IDApiTemplate: string;
    IsDefault: string;
    Name: string;
}

export type IByMerchant = {
    [key: string]: IByMerchantItem;
}

export type IByMerchantItem = {
    games: Game[];
    categories: IIndexingBoolean;
}

export type IByCategory = {
    [key: string]: IByCategoryItem;
}

export type IByCategoryItem = {
    title: IIndexingString;
    games: Game[];
    merchants: IIndexingBoolean;
}

export type IMerchantCurrency = {
    Currencies: string[];
    DefaultCurrency: boolean;
    ID: string;
    IDMerchant: string;
    IsDefault: string;
    Name: string;
}

export type ICategory = {
    ID: string;
    Name: IIndexingString;
    Tags: string[];
    Trans: IIndexingString;
    menuId: string;
    Slug: string;
    en?: string;
    CSort: string;
    CSubSort: string;
    MappingName?: string;
}

export type IGames = {
    categories: ICategory[];
    countriesRestrictions: ICountriesRestrictions;
    games: Game[];
    merchants: IMerchants;
    merchantsCurrencies: IMerchantCurrency[];
}

export type IMerchantsMapping = {
    merchantIdToNameMapping: IIndexingString;
    merchantIdToAliasMapping: IIndexingString;
    merchantNameToIdMapping: IIndexingString;
    merchantNameToTitleMapping: IIndexingString;
}

export type IRestrictions = {
    restrictedByID: { [key: string]: IIndexingBoolean; };
    restrictedByDefault: { [key: string]: IIndexingBoolean; };
}

export type ICategoriesMapping = {
    categoryById: IIndexing<ICategory>;
    categoryIdToNameMapping: IIndexingString;
    categoryNameToIdMapping: IIndexingString;
    categoryIdToTitleMapping: { [key: string]: IIndexingString; };
    categoryNameToTitleMapping: { [key: string]: IIndexingString; };
}

/**
 * INTERFACES
 */
export interface IAvailableItem {
    id: string;
    value: string;
}

export interface IAvailableMerchants extends IAvailableItem {
    title: string;
}

export interface IAvailableCategories extends IAvailableItem {
    title: IIndexingString;
    sort: number;
}

export interface ISupportedItem {
    value: string;
    title: string;
}

export interface ICatalogTreeItem extends ISupportedItem {
    subcategories: ISupportedItem[];
}

export interface IIndexingMerchants {
    [key: string]: IMerchant;
}

export interface IIndexingCategories {
    [key: string]: ICategory;
}

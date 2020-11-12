import {IIndexing} from 'wlc-engine/interfaces/index';
import {Game, AbstractGame} from 'wlc-engine/modules/games/models/game.model';

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
    categories: IIndexing<boolean>;
}

export type IByCategory = {
    [key: string]: IByCategoryItem;
}

export type IByCategoryItem = {
    title: IIndexing<string>;
    games: Game[];
    merchants: IIndexing<boolean>;
}

export type IMerchantCurrency = {
    Currencies: string[];
    DefaultCurrency: string;
    ID: string;
    IDMerchant: string;
    IsDefault: string;
    Name: string;
}

export type ICategory = {
    ID: string;
    Name: IIndexing<string>;
    Tags: string[];
    Trans: IIndexing<string>;
    menuId: string;
    Slug: string;
    en?: string;
    CSort: string;
    CSubSort: string;
    MappingName?: string;
    visibility?: boolean;
}

export type IGames = {
    categories: ICategory[];
    countriesRestrictions: ICountriesRestrictions;
    games: AbstractGame[];
    merchants: IMerchants;
    merchantsCurrencies: IMerchantCurrency[];
}

export type IMapping = {
    merchantIdToNameMapping: IIndexing<string>;
    merchantIdToAliasMapping: IIndexing<string>;
    merchantNameToIdMapping: IIndexing<string>;
    merchantNameToTitleMapping: IIndexing<string>;
    byMerchant: IByMerchant;

    categoryById: IIndexing<ICategory>;
    categoryIdToNameMapping: IIndexing<string>;
    categoryNameToIdMapping: IIndexing<string>;
    categoryIdToTitleMapping: { [key: string]: IIndexing<string>; };
    categoryNameToTitleMapping: { [key: string]: IIndexing<string>; };
    byCategory: IByCategory;
}

export type IRestrictions = {
    restrictedByID: { [key: string]: IIndexing<boolean>; };
    restrictedByDefault: { [key: string]: IIndexing<boolean>; };
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
    title: IIndexing<string>;
    sort: number;
}

export interface ISupportedItem {
    value: string;
    title: string;
}

export interface ICatalogTreeItem extends ISupportedItem {
    subcategories: ISupportedItem[];
}

export interface IGameParams {
    merchantId: string;
    launchCode: string;
    demo: number;
    gameId: string;
    lang?: string;
}

export interface ICustomGameParams {
    merchantId?: string;
    launchCode?: string;
    gameId?: string;
    hideTitle?: boolean;
    autoresize?: boolean;
    sportsbookPage?: string;
    lang?: string;
}

export interface ILaunchInfo {
    config: {
        AR: string,
        AuthToken?: string
    };
    gameHtml: string;
    gameScript: string;
    merchant: string;
    merchantId: string;
    mobilePlatform: boolean;
}

export interface IIndexingMerchants {
    [key: string]: IMerchant;
}

export interface IIndexingCategories {
    [key: string]: ICategory;
}

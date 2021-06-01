import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';

export interface IGamesConfig {
    sportsbookMerchants?: number[];
    run?: IRunGameOptions;
    mobile?: IMobileGames;
    realPlay?: IRealPlayOptions;
    categories?: ICategories;
    mediaFormatTypes?: IIndexing<string>;
    idVerticalVideos?: number[];
    /**
     * exclude required fields
     *
     * @example
     * <pre>
     * excludeRequiredFields: {
     *   992: ["DateOfBirth", "Gender"],
     *   944: ["DateOfBirth", "Gender"],
     * },
     * </pre>
     */
    excludeRequiredFields?: IIndexing<string[]>;
}

export interface ICategories {
    useFundistJackpots?: boolean;
    exclude?: IExcludeCategories;
    sort?: ISortCategories,
    parents?: string[];
}

export interface IExcludeCategories {
    bySlug?: string[];
}

export interface ISortCategories {
    byDefault?: IIndexing<number>;
}

export interface IRealPlayOptions {
    disable?: boolean;
    disableByCountry?: IDisablePlayRealByCountry;
}

export interface IDisablePlayRealByCountry {
    default?: string[];
    forMerchant?: IIndexing<string[]>;
}

export interface IRunGameOptions {
    skipCheckBalance?: boolean;
    checkProfileRequiredFields?: boolean;
    checkActiveBonusRestriction?: boolean;
}

export interface IMobileGames {
    loginUser?: IMobileLoginUser;
}

export interface IMobileLoginUser {
    disableDemo?: boolean;
}

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

export interface IByMerchantItem {
    games: Game[];
    categories: IIndexing<IByMerchantItemCategory>;
}

export interface IByMerchantItemCategory {
    menuId: string,
    slug: string,
    id: number,
    sort: number,
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
    ParentID?: string;
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
    games: IGame[];
    merchants: IMerchants;
    merchantsCurrencies: IMerchantCurrency[];
}

export type IMapping = {
    merchantIdToNameMapping?: IIndexing<string>;
    merchantIdToAliasMapping?: IIndexing<string>;
    merchantNameToObjectMapping?: IIndexing<MerchantModel>,
    merchantNameToIdMapping?: IIndexing<number>;
    merchantNameToTitleMapping?: IIndexing<string>;
    byMerchant?: IByMerchant;
    categoryById?: IIndexing<CategoryModel>;
    categoryByName?: IIndexing<CategoryModel>
    categoryIdToNameMapping?: IIndexing<string>;
    categoryNameToIdMapping?: IIndexing<number>;
    categoryIdToTitleMapping?: { [key: string]: IIndexing<string>; };
    categoryNameToTitleMapping?: { [key: string]: IIndexing<string>; };
    byCategory?: IByCategory;
}

export type IRestrictions = {
    restrictedByID: { [key: string]: IIndexing<boolean>; };
    restrictedByDefault: { [key: string]: IIndexing<boolean>; };
}

export type IJackpot = {
    LaunchCode: string;
    MerchantID: string;
    MerchantName: string;
    amount: number;
    currency: string;
    game: string;
    id: string;
    image: string;
}

export type IFavourite = {
    game_id: string;
    favorite?: boolean;
}

export interface ILastPlayedGame {
    ID: string;
    Image: string;
}

/**
 * INTERFACES
 */
export interface IAvailableItem {
    id: string;
    value: string;
}

export interface ISupportedItem {
    value: string;
    title: string;
}

export interface ICatalogTreeItem extends ISupportedItem {
    subcategories: ISupportedItem[];
}

export interface IGameParams {
    merchantId: number;
    launchCode: string;
    demo: boolean;
    gameId: string;
    lang?: string;
}

export interface ICustomGameParams {
    merchantId?: number;
    launchCode?: string;
    demo?: boolean;
    gameId?: number;
    hideTitle?: boolean;
    autoresize?: boolean;
    isSportsbook?: boolean;
    sportsbookPage?: string;
    disableIframeDefaultResize?: boolean;
    disableIframeSelfResize?: boolean;
    minGameWindowHeight?: number;
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

export interface IStartGameOptions {
    demo: boolean;
}

export interface ILaunchParamsOptions {
    launchCode: string;
    merchantId: string;
    demo: boolean;
    lang: string;
}

export interface IGame {
    ID: string;
    Image: string;
    hasDemo: number;
    Url: string;
    Name: IIndexing<string>;
    CategoryID: string[];
    Description: IIndexing<string> | string[];
    LaunchCode: string;
    MerchantID: string;
    SubMerchantID: string;
    Sort: string;
    SortPerCategory: IIndexing<number>;
    MobileUrl: string;
    MobileAndroidUrl?: string;
    MobileWindowsUrl?: string;
    SuperBranded: number;
    Branded: number;
    AR: string;
    IDCountryRestriction: string;
    PageCode: string;
    MobilePageCode: string;
    MobileAndroidPageCode: string;
    MobileWindowsPageCode: string;
    ExternalCode: string;
    MobileExternalCode: string;
    ImageFullPath: string;
    WorkingHours: string;
    IsVirtual: string;
    TableID: string;
    isRestricted: boolean;
    Freeround?: string;
}

export type TGameImageSize = 196 | 208 | 232 | 250 | 315 | 640;

/**
 * CONSTANTS
 */
export const gamesEvents: IIndexing<string> = {
    FETCH_GAME_CATALOG: 'FETCH_GAME_CATALOG',
    FETCH_GAME_CATALOG_STARTED: 'FETCH_GAME_CATALOG_STARTED',
    FETCH_GAME_CATALOG_FAILED: 'FETCH_GAME_CATALOG_FAILED',
    FETCH_GAME_CATALOG_SUCCEEDED: 'FETCH_GAME_CATALOG_SUCCEEDED',
    FETCH_LAST_GAME_CATALOG_FAILED: 'FETCH_LAST_GAME_CATALOG_FAILED',
    FETCH_LAST_GAME_CATALOG_SUCCEEDED: 'FETCH_LAST_GAME_CATALOG_SUCCEEDED',
    FETCH_JACKPOTS: 'FETCH_JACKPOTS',
    FETCH_JACKPOTS_STARTED: 'FETCH_JACKPOTS_STARTED',
    FETCH_JACKPOTS_FAILED: 'FETCH_JACKPOTS_FAILED',
    FETCH_JACKPOTS_SUCCEEDED: 'FETCH_JACKPOTS_SUCCEEDED',
    FETCH_LAST_WINS: 'FETCH_LAST_WINS',
    FETCH_LAST_WINS_STARTED: 'FETCH_LAST_WINS_STARTED',
    FETCH_LAST_WINS_FAILED: 'FETCH_LAST_WINS_FAILED',
    FETCH_LAST_WINS_SUCCEEDED: 'FETCH_LAST_WINS_SUCCEEDED',
    FETCH_FAVOURITES_SUCCEEDED: 'FETCH_FAVOURITES_SUCCEEDED',
    FETCH_FAVOURITES_FAILED: 'FETCH_FAVOURITES_FAILED',
};

export interface ISearchFilter {
    array: Game[],
    regExp: string,
}

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {ICategoryBlock} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {TotalJackpotNoContentByThemeType} from 'wlc-engine/modules/games/components/total-jackpot/total-jackpot.params';

export type TSortDirection = 'asc' | 'desc';
/**
* Disable demo for all users or only for authentificated users
*/
export type TDisableDemoFor = 'all' | 'auth';

export interface IGamesConfig {
    fundist?: IFundist;
    sportsbookMerchants?: number[];
    run?: IRunGameOptions;
    mobile?: IMobileGames;
    realPlay?: IRealPlayOptions;
    categories?: ICategories;
    gameDashboard?: IGameDashboard;
    mediaFormatTypes?: IIndexing<string>;
    idVerticalVideos?: number[];
    verticalThumbsConfigUrl?: string;
    verticalImagesPath?: string;
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
    components?: IGamesComponents;
    slimGamesRequest?: boolean;
    search?: IGamesSearchSettings;
    /**
     * Disable demo btn in wlc-game-thumb & wlc-play-for-real for all users or only for authentificated users
     */
    disableDemoBtnsFor?: TDisableDemoFor;
    merchantWallet?: IMerchantWalletConfig;
}

export interface IGamesSearchSettings {
    byCyrillicLetters?: boolean;
}

export interface IFundist {
    defaultCategorySettings: IFundistDefaultCategorySettings
}

export interface IFundistDefaultCategorySettings {
    use: boolean;
}

export interface IGamesComponents {
    'wlc-total-jackpot'?: {
        noContent?: TotalJackpotNoContentByThemeType,
    }
}

export interface ICategories {
    useFundistJackpots?: boolean;
    exclude?: IExcludeCategories;
    /** settings for hide some categories
     * (hidden categories will be work, but not will be shown in user interface) */
    hide?: IHideCategories;
    sort?: ISortCategories,
    parents?: string[];
    /** setting sorting games in category */
    gamesSortSetting?: IGamesSortSetting;
}

export interface IGameDashboard {
    mobileUsageInstruction?: IDashboardMobileUsageInstruction;
}

export interface IDashboardMobileUsageInstruction {
    disable?: boolean;
}

export interface IGamesSortSetting {
    direction?: {
        /** direction of sorting by sortPerLanguage, 'asc' by default */
        sortPerLanguage?: TSortDirection,
        /** direction of sorting by sortPerCategory, 'asc' by default */
        sortPerCategory?: TSortDirection;
        /** direction of sorting by general sort value, 'desc' by default */
        baseSort?: TSortDirection;
    }
}

export interface IExcludeCategories {
    bySlug?: string[];
}

export interface IHideCategories {
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
    notRunInIframe?: INotRunInIframe;
    showGameHeader?: IShowGameHeader;
}

export interface IMobileLoginUser {
    disableDemo?: boolean;
}

export interface INotRunInIframe {
    [key: string]: IExcludeMerchantSettings;
}

export interface IShowGameHeader {
    merchants: number[];
}

export interface IExcludeMerchantSettings {
    launchCodes?: string[];
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
    Settings?: IIndexing<string>;
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
    DefaultCurrency: string | null;
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
    CustomSort?: ICustomSort | [];
    MappingName?: string;
    visibility?: boolean;
}

export interface IGameBlock {
    category: CategoryModel;
    games: Game[];
    settings: ICategoryBlock;
}

export type IGames = {
    categories: ICategory[];
    countriesRestrictions: ICountriesRestrictions;
    games: IGame[];
    merchants: IMerchants;
    merchantsCurrencies: IMerchantCurrency[];
}

export type TGamesResponse = {
    data: IGames;
};

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
    categoryIdToTitleMapping?: {[key: string]: IIndexing<string>;};
    categoryNameToTitleMapping?: {[key: string]: IIndexing<string>;};
    byCategory?: IByCategory;
}

export type IRestrictions = {
    restrictedByID: {[key: string]: IIndexing<boolean>;};
    restrictedByDefault: {[key: string]: IIndexing<boolean>;};
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

export interface IGameParams {
    merchantId: number;
    launchCode: string;
    demo: boolean;
    gameId: string;
    lang?: string;
    returnUrl?: string;
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
    Name: IIndexing<string>;
    Image: string;
    Url: string;
    hasDemo: number;
    CategoryID: string[];
    MerchantID: string;
    AR: string;
    IDCountryRestriction: string | null;
    Sort: string;
    LaunchCode: string;
    SortPerCategory: IIndexing<number> | [];
    SubMerchantID: string | null;
    CustomSort: ICustomSort | [];

    Description?: IIndexing<string> | string[];
    MobileAndroidUrl?: string;
    MobileWindowsUrl?: string;
    SuperBranded?: number;
    Branded?: number;
    PageCode?: string;
    MobilePageCode?: string;
    MobileAndroidPageCode?: string;
    MobileWindowsPageCode?: string;
    ExternalCode?: string;
    MobileExternalCode?: string;
    ImageFullPath?: string;
    WorkingHours?: string;
    IsVirtual?: string;
    TableID?: string;
    isRestricted?: boolean;
    Freeround?: string;
}

export interface ICustomSort {
    Lang?: IIndexing<number>;
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
    UPDATED_AVAILABLE_GAMES: 'UPDATED_AVAILABLE_GAMES',
};

export interface ISearchFilter {
    array: Game[],
    regExp: string,
}

/**
 * @param availableMerchants - number array of merchants IDs which have external wallet
 * @param balanceRequestTimeout number of timeout for interval request. 30000 by default
 * @param systemOptions objects with options for each of available systems, key is system ID,
 * value is `IMerchantWalletSystemConfig`
 */
export interface IMerchantWalletConfig {
    availableMerchants?: number[];
    balanceRequestTimeout?: number;
    systemOptions?: IIndexing<IMerchantWalletSystemConfig>;
}

/**
 * @param minDeposit value of min deposit value; default is 0.1
 * @param maxDeposit value of max deposit value; default is 10000
 * @param minWithdraw value of min withdraw value; default is 1
 * @param maxWithdraw value of min withdraw value; default is 100 before user balance will be got
 */
export interface IMerchantWalletSystemConfig {
    minDeposit?: number;
    maxDeposit?: number;
    minWithdraw?: number;
    maxWithdraw?: number;
    currency?: string;
}

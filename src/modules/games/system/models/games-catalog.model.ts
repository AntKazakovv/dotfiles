import {
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces';

import {
    IByCategory,
    IByMerchant,
    IMerchant,
    ICategory,
    ISupportedItem,
    ICatalogTreeItem,
    IGames,
    IMapping,
    IRestrictions, IJackpot, gamesEvents, IFavourite,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {UIRouter} from '@uirouter/core';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {ILanguage} from 'wlc-engine/modules/core';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import {
    concat as _concat,
    find as _find,
    isArray as _isArray,
    sortBy as _sortBy,
    toNumber as _toNumber,
    forEach as _forEach,
    get as _get,
    includes as _includes,
    filter as _filter,
} from 'lodash';

export class GamesCatalog {
    public currentLanguage: ILanguage;

    protected games: Game[];
    protected categories: CategoryModel[];
    protected merchants: IMerchant[];
    protected restrictions: IRestrictions;
    protected availableCategories: CategoryModel[];
    protected availableMerchants: IMerchant[];
    protected supportedCategories: ISupportedItem[];
    protected supportedMerchants: ISupportedItem[];

    protected configService: ConfigService;
    protected eventService: EventService;
    protected router: UIRouter;

    constructor(
        data: IGames,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        // TODO
        this.currentLanguage = {
            code: 'en',
            label: '',
        };

        this.configService = this.gamesCatalogService.configService;
        this.eventService = this.gamesCatalogService.eventService;
        this.router = this.gamesCatalogService.router;

        this.processFetchedGamesCatalog(data);
    }

    /**
     *
     * @param {string[]} includeCategories
     * @param {string[]} includeMerchants
     * @param {string[]} excludeCategories
     * @param {string[]} excludeMerchants
     * @returns {Game[]}
     */
    public getGameList(filter?: IGamesFilterData): Game[] {
        const includeCategories = filter?.categories || [];
        const excludeCategories = filter?.excludeCategories || [];
        const includeMerchants = filter?.merchants || [];
        const excludeMerchants = filter?.excludeMerchants || [];
        const searchQuery = filter?.searchQuery || '';

        let gameList: Game[] = _concat([], this.games);

        if (includeCategories.length) {
            const categories: CategoryModel[] = this.getCategoriesByMenuIds(includeCategories);
            gameList = this.getGamesByCategories(categories);
        }

        if (excludeCategories.length) {
            const exclCategoryIds: string[] = [];

            _forEach(excludeCategories, (exclCategory: string) => {
                const exclCategoryId = GamesHelper.getCategoryIdByName(exclCategory);
                if (exclCategoryId) {
                    exclCategoryIds.push(exclCategoryId);
                }
            });

            gameList = gameList.filter((item: Game): boolean => {
                let rv = true;
                for (const exclCategoryId of exclCategoryIds) {
                    rv = rv && (!item.categoryID?.includes(exclCategoryId));
                }
                return rv;
            });
        }

        if (includeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return includeMerchants.includes(item.merchantID)
                    || includeMerchants.includes(item.subMerchantID);
            });
        }

        if (excludeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return !excludeMerchants.includes(item.merchantID)
                    && !excludeMerchants.includes(item.subMerchantID);
            });
        }

        if (searchQuery) {
            gameList = gameList.filter((game: Game) => {
                const name = _get(game.name, this.currentLanguage.code)
                    || _get(game.name, 'en', '');

                return name.toLowerCase().indexOf(searchQuery) !== -1;
            });
        }

        return gameList;
    }

    /**
     *
     * @returns {CategoryModel[]}
     */
    public getCategories(): CategoryModel[] {
        return this.categories;
    }

    /**
     * Get categories by menu ids
     *
     * @param {string[]} menuIds
     * @returns {CategoryModel[]}
     */
    public getCategoriesByMenuIds(menuIds: string[]): CategoryModel[] {
        return _filter(this.getCategories(), (category: CategoryModel) => {
            return _includes(menuIds, category.menuId);
        });
    }

    /**
     *
     * @returns {IMerchant[]}
     */
    public getMerchants(): IMerchant[] {
        return this.merchants;
    }

    /**
     *
     * @returns {IMerchant[]}
     */
    public getAvailableMerchants(): IMerchant[] {
        return this.availableMerchants;
    }

    /**
     *
     * @returns {CategoryModel[]}
     */
    public getAvailableCategories(): CategoryModel[] {
        return this.availableCategories;
    }

    public getCategoryByName(categoryName: string): CategoryModel {
        return _find(this.categories, ['menuId', categoryName]);
    }

    public getCategoryTitle(
        type: 'merchant' | 'category',
        category: string,
        subcategory?: string,
        language?: string,
    ): string | IIndexing<string> {
        if (type === 'merchant') {
            if (typeof subcategory !== 'undefined' && !!subcategory) {
                if (GamesHelper.mapping.byCategory.hasOwnProperty(subcategory)) {
                    return GamesHelper.mapping.byCategory[subcategory].title.hasOwnProperty(language) ?
                        GamesHelper.mapping.byCategory[subcategory].title[language] :
                        GamesHelper.mapping.byCategory[subcategory].title.en;
                }
            }

            if (GamesHelper.mapping.merchantNameToTitleMapping.hasOwnProperty(category)) {
                return GamesHelper.mapping.merchantNameToTitleMapping[category];
            }
        }

        if (type === 'category') {
            if (typeof subcategory !== 'undefined' && !!subcategory) {
                if (GamesHelper.mapping.categoryNameToTitleMapping.hasOwnProperty(subcategory)) {
                    return GamesHelper.mapping.categoryNameToTitleMapping[subcategory];
                }
            }

            if (GamesHelper.mapping.byCategory.hasOwnProperty(category)) {
                return GamesHelper.mapping.byCategory[category].title.hasOwnProperty(language) ?
                    GamesHelper.mapping.byCategory[category].title[language] :
                    GamesHelper.mapping.byCategory[category].title.en;
            }
        }

        return '';
    }

    /**
     *
     * @param {string} id
     * @returns {Game}
     */
    public getGameById(id: number): Game {
        return _find(this.games, {ID: id});
    }

    /**
     *
     * @param {string} merchantID
     * @param {string} launchCode
     * @returns {Game}
     */
    public getGame(merchantID: string, launchCode: string): Game {
        return _find(this.games, {merchantID, launchCode});
    }

    /**
     * Get games by categories
     *
     * @param {CategoryModel} categories Game categories
     * @returns {Game[]} Filtered games list
     */
    public getGamesByCategories(categories: CategoryModel[]): Game[] {
        const categoryIds = categories.map((category: CategoryModel) => {
            return category.id;
        });

        const games = _filter(this.getGameList(), (game: Game) => {
            for (const categoryId of categoryIds) {
                if (_includes(game.categoryID, categoryId)) {
                    return true;
                }
            }
            return false;
        });
        return games;
    }

    /**
     *
     * @param {string} merchantName
     * @returns {IMerchant}
     */
    public getMerchantByName(merchantName: string): IMerchant {
        return _find(this.merchants, {menuId: merchantName});
    }

    /**
     *
     * @param {string} merchantId
     * @param {string} launchCode
     * @returns {string}
     */
    public getGameName(merchantId: string, launchCode: string): string {
        return this.getGame(merchantId, launchCode)?.name?.en || '';
    }

    public getCatalogTree(type: string, name: string): ICatalogTreeItem[] {
        let tree: ICatalogTreeItem[] = [];

        if (type === 'merchant') {
            const merchantList = this.getSupportedMerchants(name);

            tree = merchantList.map((merchant: ISupportedItem): ICatalogTreeItem => {
                (merchant as ICatalogTreeItem).subcategories = this.getSupportedCategories(merchant.value);
                return merchant as ICatalogTreeItem;
            });
        } else {
            const categoryList = this.getSupportedCategories(name);

            tree = categoryList.map((category: ISupportedItem): ICatalogTreeItem => {
                (category as ICatalogTreeItem).subcategories = this.getSupportedMerchants(category.value);
                return category as ICatalogTreeItem;
            });
        }

        return tree;
    }

    /**
     *
     * @param {IJackpot[]} jackpots
     */
    public loadJackpots(jackpots: IJackpot[]): void {
        const categoryId = GamesHelper.getCategoryIdByName('jackpot');

        _forEach(jackpots, jackpot => {
            const game: Game = this.getGame(jackpot.MerchantID, jackpot.LaunchCode);
            if (game) {
                game.jackpot = jackpot.amount;
                if (!game.categoryID.includes(categoryId)) {
                    game.categoryID.push(categoryId);
                }
            }
        });
    }

    /**
     *
     * @param {IFavourite[]} favourites
     */
    public loadFavourites(favourites: IFavourite[]): void {
        _forEach(favourites, favourite => {
            const game: Game = this.getGameById(favourite.game_id);
            if (game) {
                game.isFavourite = true;
            }
        });
    }

    // TODO не понятно, надо оно или нет

    /*public getMerchantCategories(merchantName: string, categoryList: string[] = []): string[] {

        if (!categoryList.length) {
            return Object.keys(this.byMerchant[merchantName].categories).sort();
        }

        const gamesList = this.byMerchant[merchantName].games;
        const categoryIds: string[] = [];
        const result: string[] = [];
        const merchantCategories = {};

        categoryList.filter((categoryName: string) => {
            const fcategoryId = this.getCategoryIdByName(categoryName);
            if (!fcategoryId) {
                return false;
            }
            categoryIds.push(fcategoryId);
        });

        gamesList.filter((game: Game) => {
            let include = true;

            for (const id of categoryIds) {
                include = include && (game.CategoryID?.indexOf(id) >= 0);
            }

            if (include) {
                for (const id of game.CategoryID) {
                    merchantCategories[id] = true;
                }
            }
        });

        for (const id of categoryIds) {
            if (merchantCategories[id]) {
                delete merchantCategories[id];
            }
        }

        for (const categoryId of Object.keys(merchantCategories)) {
            result.push(this.getCategoryNameById(categoryId));
        }

        return result.sort();
    }*/


    // TODO не понятно, надо оно или нет
    /* public getGameCategoryTitle(game: Game, language: string): string {
         const categoryCount = game.CategoryID.length;
         let currentCategoryId: string = null;
         const virtualCategories = [
             this.categoryNameToIdMapping.jackpots,
             this.categoryNameToIdMapping.mainPage,
             this.categoryNameToIdMapping.new,
             this.categoryNameToIdMapping.popular
         ];

         for (let i = 0; i < categoryCount; i++) {
             currentCategoryId = game.CategoryID[i];

             if (virtualCategories.indexOf(currentCategoryId) === -1 &&
                 this.categoryIdToTitleMapping[currentCategoryId]) {
                 return this.categoryIdToTitleMapping[currentCategoryId].hasOwnProperty(language) ?
                     this.categoryIdToTitleMapping[currentCategoryId][language] :
                     this.categoryIdToTitleMapping[currentCategoryId].en;
             }
         }

         return null;
     }*/


    /**
     *
     * @param {string} categoryName
     * @returns {ISupportedItem[]}
     */
    protected getSupportedMerchants(categoryName: string): ISupportedItem[] {
        let list: string[] = Object.keys(GamesHelper.getMerchantsByCategory(categoryName));

        if (!categoryName) {
            list = Object.keys(GamesHelper.mapping.byMerchant);
        }

        return list.map((merchantName: string): ISupportedItem => {
            return {value: merchantName, title: merchantName};
        });
    }

    /**
     *
     * @param {string} merchantName
     * @returns {ISupportedItem[]}
     */
    protected getSupportedCategories(merchantName: string): ISupportedItem[] {
        let list: string[] = Object.keys(GamesHelper.getCategoriesByMerchant(merchantName));

        if (!merchantName) {
            list = Object.keys(GamesHelper.mapping.byCategory);
        }

        return list.map((categoryName: string): ISupportedItem => {
            return {value: categoryName, title: categoryName};
        });
    }

    /**
     *
     * @param {IGames} response
     */
    protected processFetchedGamesCatalog(response: IGames): void {
        this.merchants = [];
        this.categories = [];
        this.availableCategories = [];
        this.availableMerchants = [];

        if (!_get(response, 'games.length')) {
            return;
        }

        /***********************************************************************************************************
         * MERCHANTS
         **********************************************************************************************************/
        const merchantMap: IIndexing<string> = this.configService
            .get<IIndexing<string>>('appConfig.siteconfig.merchantNameAliasesMap') || {};
        const mapMerchants = GamesHelper.mapMerchants(response.merchants, merchantMap);
        this.merchants = mapMerchants.merchantsArray;

        /***********************************************************************************************************
         * CATEGORIES
         **********************************************************************************************************/
        const mapCategories = GamesHelper.mapCategories(response.categories);
        this.categories = GlobalHelper.sortByNumber<CategoryModel>(mapCategories.categoriesArray, 'sort', true);

        /***********************************************************************************************************
         * COUNTRIES RESTRICTIONS
         **********************************************************************************************************/
        // TODO а как надо по дефолту то????
        const enableCountryRestriction: boolean = this.configService.get<boolean>('appConfig.games.enableRestricted') || true;
        const authUserAppConfigCountry = this.configService.get<string>('appConfig.user.country') || null;
        // TODO надо дописать, когда будет UserService
        const authUserCountry = authUserAppConfigCountry;
        // const authUserCountry = this.UserService.isAuthenticated() ?
        //     this.UserService.userProfile.countryCode || authUserAppConfigCountry : authUserAppConfigCountry;
        const country: string = this.configService.get<string>('appConfig.country') || 'unknown';
        const restrictCountries: string[] = [country];

        if (authUserCountry) {
            restrictCountries.push(authUserCountry);
        }

        this.restrictions = GamesHelper.createRestrictions(response.countriesRestrictions);

        /***********************************************************************************************************
         * GAMES
         **********************************************************************************************************/
        const resultGames: Game[] = [];

        for (const item of response.games) {
            const game = new Game(item, this.router);

            if (!_isArray(game.categoryID)) {
                continue;
            }

            if (enableCountryRestriction && game.gameRestricted(this.restrictions, restrictCountries)) {
                continue;
            }

            const merchantName: string = game.getMerchantName();
            if (!merchantName) {
                continue;
            }

            game.isFavourite = this.gamesCatalogService.favourites.includes(game.ID);
            game.setSortedCategoryFields();
            GamesHelper.fillGamesByCategoriesMerchants(game, this.availableCategories, this.availableMerchants);
            resultGames.push(game);
        }

        this.availableCategories = GlobalHelper.sortByNumber<CategoryModel>(this.availableCategories, 'sort', true);

        this.games = _sortBy(resultGames, (item: Game) => {
            return _toNumber(item.sort);
        });
    }

}

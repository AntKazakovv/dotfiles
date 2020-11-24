import {
    IIndexing,
} from 'wlc-engine/interfaces';

import {
    IAvailableCategories,
    IAvailableMerchants,
    IByCategory,
    IByMerchant,
    IMerchant,
    ICategory,
    ISupportedItem,
    ICatalogTreeItem,
    IGames,
    IMapping,
    IRestrictions, IJackpot, gamesEvents,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

import {GamesHelper} from 'wlc-engine/modules/games/games.helpers';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {UIRouter} from '@uirouter/core';
import {EventService} from 'wlc-engine/modules/core/services';

import {
    concat as _concat,
    find as _find,
    isArray as _isArray,
    sortBy as _sortBy,
    toNumber as _toNumber,
    forEach as _forEach,
    get as _get,
} from 'lodash';

export class GamesCatalog {
    protected games: Game[];
    protected categories: ICategory[];
    protected merchants: IMerchant[];
    protected restrictions: IRestrictions;
    protected availableCategories: IAvailableCategories[];
    protected availableMerchants: IAvailableMerchants[];
    protected supportedCategories: ISupportedItem[];
    protected supportedMerchants: ISupportedItem[];

    constructor(
        data: IGames,
        protected ConfigService: ConfigService,
        protected eventService: EventService,
        protected router: UIRouter,
    ) {
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
    public getGameList(
        includeCategories: string[] = [],
        includeMerchants: string[] = [],
        excludeCategories: string[] = [],
        excludeMerchants: string[] = [],
    ): Game[] {

        let gameList: Game[] = _concat([], this.games);

        if (includeCategories.length) {
            let categoryId = null;
            const includeCategoryIds: string[] = [];
            const includeCategoryIdsAnd = {};

            for (const includeCategory of includeCategories) {
                let categoryNameAnd = false;
                let categoryName = includeCategory;

                if (categoryName[0] === '+') {
                    categoryName = categoryName.substr(1);
                    categoryNameAnd = true;
                }

                categoryId = GamesHelper.getCategoryIdByName(categoryName);

                if (!categoryId) {
                    continue;
                }

                includeCategoryIdsAnd[categoryId] = categoryNameAnd;
                includeCategoryIds.push(categoryId);
            }

            gameList = gameList.filter((item: Game) => {
                let rv: boolean = false;

                _forEach(includeCategoryIds, (cat: string) => {
                    if (!includeCategoryIdsAnd[cat]) {
                        rv = rv || (item.categoryID?.includes(cat));
                    } else {
                        rv = rv && (item.categoryID?.includes(cat));
                    }

                });
                return rv;
            });
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

        return gameList;
    }

    /**
     *
     * @returns {ICategory[]}
     */
    public getCategories(): ICategory[] {
        return this.categories;
    }

    /**
     *
     * @returns {IMerchant[]}
     */
    public getMerchants(): IMerchant[] {
        return this.merchants;
    }

    // TODO часть функций надо сделать protected
    public getAvailableCategories(): IAvailableCategories[] {
        return this.availableCategories;
    }

    public getAvailableMerchants(): IAvailableMerchants[] {
        return this.availableMerchants;
    }

    public getCategoryByName(categoryName: string): ICategory {
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
        })
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
        const merchantMap: IIndexing<string> = this.ConfigService
            .get<IIndexing<string>>('appConfig.siteconfig.merchantNameAliasesMap') || {};
        const mapMerchants = GamesHelper.mapMerchants(response.merchants, merchantMap);
        this.merchants = mapMerchants.merchantsArray;

        /***********************************************************************************************************
         * CATEGORIES
         **********************************************************************************************************/
        const mapCategories = GamesHelper.mapCategories(response.categories);
        this.categories = mapCategories.categoriesArray;

        /***********************************************************************************************************
         * COUNTRIES RESTRICTIONS
         **********************************************************************************************************/
            // TODO а как надо по дефолту то????
        const enableCountryRestriction: boolean = this.ConfigService.get<boolean>('appConfig.games.enableRestricted') || true;
        const authUserAppConfigCountry = this.ConfigService.get<string>('appConfig.user.country') || null;
        // TODO надо дописать, когда будет UserService
        const authUserCountry = authUserAppConfigCountry;
        // const authUserCountry = this.UserService.isAuthenticated() ?
        //     this.UserService.userProfile.countryCode || authUserAppConfigCountry : authUserAppConfigCountry;
        const country: string = this.ConfigService.get<string>('appConfig.country') || 'unknown';
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

            game.setSortedCategoryFields();
            GamesHelper.fillGamesByCategoriesMerchants(game, this.availableCategories, this.availableMerchants);
            resultGames.push(game);
        }

        this.games = _sortBy(resultGames, (item: Game) => {
            return _toNumber(item.sort);
        });
    }


}

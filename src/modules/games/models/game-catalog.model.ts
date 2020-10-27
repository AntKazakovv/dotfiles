import {IIndexing} from 'wlc-engine/interfaces';

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
    IMerchantsMapping,
    ICategoriesMapping,
    IRestrictions,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

import {GamesHelper} from "wlc-engine/modules/games/games.helpers";
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {Game} from 'wlc-engine/modules/games/models/game.model';

import {
    concat as _concat,
    find as _find,
    isArray as _isArray,
    toNumber as _toNumber,
    each as _each,
    get as _get,
    assign as _assign,
} from 'lodash';


export class GameCatalog {
    loaded: boolean;

    protected games: Game[];
    protected categories: ICategory[];
    protected merchants: IMerchant[];
    protected merchantsMapping: IMerchantsMapping;
    protected categoriesMapping: ICategoriesMapping;
    protected restrictions: IRestrictions;
    protected availableCategories: IAvailableCategories[];
    protected availableMerchants: IAvailableMerchants[];
    protected byMerchant: IByMerchant;
    protected byCategory: IByCategory;
    protected supportedCategories: ISupportedItem[];
    protected supportedMerchants: ISupportedItem[];

    constructor(data: IGames) {
        // TODO удалить после добавления подписок в сервис
        Object.assign(this, data);
        this.processFetchedGameCatalog(data);
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
        excludeMerchants: string[] = []
    ): Game[] {

        let gameList: Game[] = _concat([], this.games);

        /*  if (includeCategories?.length) {
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

                  categoryId = this.categoryNameToIdMapping[categoryName];

                  if (!categoryId) {
                      continue;
                  }

                  includeCategoryIdsAnd[categoryId] = categoryNameAnd;
                  includeCategoryIds.push(categoryId);
              }

              gameList = gameList.filter((item: Game) => {
                  let rv: boolean = false;
                  for (const catId in includeCategoryIds) {
                      if (!includeCategoryIdsAnd[includeCategoryIds[catId]]) {
                          rv =  rv || (item.CategoryID?.indexOf(includeCategoryIds[catId]) !== -1);
                      } else {
                          rv =  rv && (item.CategoryID?.indexOf(includeCategoryIds[catId]) !== -1);
                      }
                  }
                  return rv;
              });
          }

          if (includeMerchants?.length) {
              gameList = gameList.filter((item: Game) => {
                  return includeMerchants.indexOf(item.MerchantID) !== -1
                      || includeMerchants.indexOf(item.SubMerchantID) !== -1;
              });
          }

          if (excludeCategories?.length) {
              let exclCategoryId: string = null;
              const exclCategoryIds: string[] = [];

              for (const exclCategory of excludeCategories) {
                  exclCategoryId = this.categoryNameToIdMapping[exclCategory];
                  if (!exclCategoryId) {
                      continue;
                  }
                  exclCategoryIds.push(exclCategoryId);
              }

              gameList = gameList.filter((item: Game): boolean => {
                  let rv = true;
                  for (const exclCategoryId of exclCategoryIds) {
                      rv = rv && (item.CategoryID?.indexOf(exclCategoryId) === -1);
                  }
                  return rv;
              });
          }

          if (excludeMerchants?.length) {
              gameList = gameList.filter((item: Game) => {
                  return excludeMerchants.indexOf(item.MerchantID) === -1 ||
                  item.SubMerchantID && item.SubMerchantID != '0' ?
                      excludeMerchants.indexOf(item.SubMerchantID) === -1 : false;
              });
          }
  */
        return gameList;
    }

    public getCategories(): ICategory[] {
        return this.categories;
    }

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

    /**
     *
     * @param {string} categoryId
     * @returns {string}
     */
    public getCategoryNameById(categoryId: string): string {
        return _get(this.categoriesMapping, `categoryIdToNameMapping[${categoryId}]`, '');
    }

    /**
     *
     * @param {string} categoryId
     * @returns {IIndexing<string>}
     */
    public getCategoryTitleById(categoryId: string): IIndexing<string> {
        return _get(this.categoriesMapping, `categoryIdToTitleMapping[${categoryId}]`, {});
    }

    /**
     *
     * @param {string} categoryId
     * @returns {ICategory}
     */
    public getCategoryById(categoryId: string): ICategory {
        return this.categoriesMapping?.categoryById[categoryId];
    }

    public getCategoryTitle(
        type: 'merchant' | 'category',
        category: string,
        subcategory?: string,
        language?: string
    ): string | IIndexing<string> {
        /*  if (type === 'merchant') {
              if (typeof subcategory !== 'undefined' && !!subcategory) {
                  if (this.hasOwnProperty('byCategory') &&
                      this.byCategory.hasOwnProperty(subcategory)) {
                      return this.byCategory[subcategory].title.hasOwnProperty(language) ?
                          this.byCategory[subcategory].title[language] :
                          this.byCategory[subcategory].title.en;
                  }
              }

              if (this.merchantNameToTitleMapping.hasOwnProperty(category)) {
                  return this.merchantNameToTitleMapping[category];
              }
          }

          if (type === 'category') {
              if (typeof subcategory !== 'undefined' && !!subcategory) {
                  if (this.categoryNameToTitleMapping.hasOwnProperty(subcategory)) {
                      return this.categoryNameToTitleMapping[subcategory];
                  }
              }

              if (this.hasOwnProperty('byCategory') && this.byCategory.hasOwnProperty(category)) {
                  return this.byCategory[category].title.hasOwnProperty(language) ?
                      this.byCategory[category].title[language] :
                      this.byCategory[category].title.en;
              }
          }*/

        return '';
    }

    public getMerchantIdByName(merchantName: string): string {
        return this.merchantsMapping?.merchantNameToIdMapping[merchantName];
    }

    public getMerchantNameById(merchantId: string): string {
        return this.merchantsMapping?.merchantIdToNameMapping[merchantId];
    }

    public getMerchantAliasById(merchantId: string): string {
        return this.merchantsMapping?.merchantIdToAliasMapping[merchantId];
    }

    public getGameCategoryList(): { [key: string]: IIndexing<string>; } {
        return this.categoriesMapping?.categoryNameToTitleMapping;
    }

    // public getGameById(id: string): Game {
    //     return _find(this.games, {ID: id});
    // }

    public getGame(merchantId: string, launchCode: string): Game {
        return _find(this.games, {MerchantID: merchantId, LaunchCode: launchCode});
    }

    public getMerchantByName(merchantName: string): IMerchant {
        return _find(this.merchants, {menuId: merchantName});
    }

    public getGameName(merchantId: string, launchCode: string): string {
        return this.getGame(merchantId, launchCode)?.Name?.en || '';
    }

    public getCategoryMerchants(categoryName: string): string[] {
        const byCategory: IByCategory = this.byCategory;
        return Object.keys(byCategory[categoryName]?.merchants || {}).sort() || [];
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


    protected getSupportedMerchants(categoryName: string): ISupportedItem[] {
        let list: string[] = [];

        if (!categoryName) {
            list = Object.keys(this.byMerchant);
        }

        if (this.byCategory?.categoryName) {
            list = Object.keys(this.byCategory[categoryName].merchants);
        }

        return list.map((merchantName: string): ISupportedItem => {
            return {value: merchantName, title: merchantName};
        });
    }

    protected getSupportedCategories(merchantName: string): ISupportedItem[] {
        let list: string[] = [];
        if (!merchantName) {
            list = Object.keys(this.byCategory);
        }

        if (this.byMerchant.hasOwnProperty(merchantName)) {
            list = Object.keys(this.byMerchant[merchantName].categories);
        }
        return list.map((categoryName: string): ISupportedItem => {
            return {value: categoryName, title: categoryName};
        });
    }

    /**
     *
     * @param {IGames} response
     */
    protected processFetchedGameCatalog(response: IGames): void {
        this.byMerchant = {};
        this.byCategory = {};
        this.merchants = [];
        this.categories = [];
        this.availableCategories = [];
        this.availableMerchants = [];

        if (!response || !response.games || !response.games.length) {
            return;
        }

        /**
         * MERCHANTS
         */
        const merchantMap: IIndexing<string> = _get(ConfigService.instance.appConfig, 'siteconfig.merchantNameAliasesMap', {});
        const mapMerchants = GamesHelper.mapMerchants(response.merchants, merchantMap);
        this.merchantsMapping = mapMerchants.merchantsMapping;
        this.merchants = mapMerchants.merchantsArray;

        /**
         * CATEGORIES
         */
        const mapCategories = GamesHelper.mapCategories(response.categories);
        this.categoriesMapping = mapCategories.categoriesMapping;
        this.categories = mapCategories.categoriesArray;

        /**
         * COUNTRIES RESTRICTIONS
         */
        // TODO а как надо по дефолту то????
        const enableCountryRestriction: boolean = _get(ConfigService.instance.appConfig, 'games.enableRestricted', true);
        const authUserAppConfigCountry = _get(ConfigService.instance.appConfig, 'user.country', null);
        // TODO надо дописать, когда будет UserService
        const authUserCountry = authUserAppConfigCountry;
        // const authUserCountry = this.UserService.isAuthenticated() ?
        //     this.UserService.userProfile.countryCode || authUserAppConfigCountry : authUserAppConfigCountry;
        const country: string = ConfigService.instance.appConfig.country || 'unknown';
        const restrictCountries: string[] = [country];

        if (authUserCountry) {
            restrictCountries.push(authUserCountry);
        }

        this.restrictions = GamesHelper.createRestrictions(response.countriesRestrictions);

        /**
         * GAMES
         */
        const resultGames: Game[] = [];

        for (const item of response.games) {
            const game = new Game(item);

            if (enableCountryRestriction && game.gameRestricted(this.restrictions, restrictCountries)) {
                continue;
            }

            const merchantName = game.getMerchantName(this.merchantsMapping);
            if (!merchantName) {
                continue;
            }

            game.setSortedCategoryFields(this.categoriesMapping.categoryIdToNameMapping);

            // console.warn('game', game);

            this.addGameToByMerchantList(merchantName, game);
            if (parseInt(game.SubMerchantID, 0)) {
                const subMerchantName = this.getMerchantNameById[game.SubMerchantID];
                if (subMerchantName && merchantName !== subMerchantName) {
                    this.addGameToByMerchantList(subMerchantName, game);
                }
            }

            _each(game.CategoryID, (categoryId: string) => {
                const category = this.getCategoryById(categoryId);
                const categoryName = this.getCategoryNameById(categoryId);
                const categoryTitle = this.getCategoryTitleById(categoryId);

                if (!this.byCategory[categoryName]) {
                    this.byCategory[categoryName] = {
                        title: categoryTitle,
                        games: [],
                        merchants: {},
                    };

                    this.availableCategories.push({
                        id: game.MerchantID,
                        value: categoryName,
                        title: categoryTitle,
                        sort: _toNumber(category.CSort || 0),
                    });
                }

                this.byCategory[categoryName].games.push(game);
                this.byCategory[categoryName].merchants[merchantName] = true;
                this.byMerchant[merchantName].categories[categoryName] = true;
            });

            resultGames.push(game);
        }

        const gamesOrderComparator = (oldVal: { value: string }, newVal: { value: string }) => {
            const iOldVal = parseInt(oldVal.value || '0', 10) || 0;
            const iNewVal = parseInt(newVal.value || '0', 10) || 0;
            if (iOldVal === iNewVal) {
                return 0;
            } else if (iOldVal < iNewVal) {
                return -1;
            }
            return 1;
        };

        // this.games = this.$filter('orderBy')(resultGames, '-Sort', false, gamesOrderComparator);

        const badGames = this.games.filter((game) => !_isArray(game.CategoryID));
        if (badGames.length) {
            // this.ErrorService.logError({code: '3.0.22', data: badGames});
            this.games = this.games.filter((game) => _isArray(game.CategoryID));
        }
    }

    protected addGameToByMerchantList(merchantName: string, game: Game): void {
        if (!this.byMerchant.hasOwnProperty(merchantName)) {
            this.byMerchant[merchantName] = {
                games: [],
                categories: {}
            };

            this.availableMerchants.push({
                id: game.MerchantID,
                value: merchantName,
                title: this.merchantsMapping?.merchantNameToTitleMapping[merchantName]
            });
        }

        this.byMerchant[merchantName].games.push(game);
    }


}

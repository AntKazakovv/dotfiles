import {UIRouter} from '@uirouter/core';
import {
    TranslateService,
} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';
import {
    skipWhile,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _cloneDeep from 'lodash-es/cloneDeep';
import _concat from 'lodash-es/concat';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _isNumber from 'lodash-es/isNumber';
import _reduce from 'lodash-es/reduce';
import _size from 'lodash-es/size';
import _toNumber from 'lodash-es/toNumber';
import _uniqBy from 'lodash-es/uniqBy';

import {OptimizationService} from 'wlc-engine/services';
import {
    EventService,
    ConfigService,
    IIndexing,
    InjectionService,
    Deferred,
    ILogObj,
    HooksService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {ICategorySettings} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {
    gamesEvents,
    IGamesSeparateSortSetting,
    IGamesSortSetting,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    ICategory,
    IExcludeCategories,
    IFavourite,
    IGames,
    IJackpot,
    IGameBlock,
    ISortCategories,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    IGamesFilterData,
    TGamesFilterMod,
} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {MenuService} from 'wlc-engine/modules/menu/system/services/menu.service';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';
import {GlobalDeps} from 'wlc-engine/modules/app/app.module';
import {Categories} from 'wlc-engine/modules/games/system/classes/categories';
import {Games} from 'wlc-engine/modules/games/system/classes/games';
import {Merchants} from 'wlc-engine/modules/games/system/classes/merchants';
import {ICategoriesSettings} from 'wlc-engine/modules/games/system/builders/categories.builder';

export const gamesCatalogHooks: IIndexing<string> = {
    modifyGame: 'modifyGame@GamesCatalogModel',
};

export class Catalog {

    public ready: Promise<void>;

    protected data: IGames;
    protected readyStatus: Deferred<void> = new Deferred<void>();
    protected sportsbooks: Game[] = [];
    protected userProfile$: BehaviorSubject<UserProfile>;
    protected userCountry: string;
    protected existMenuSettings: boolean;
    protected optimizationService: OptimizationService;

    constructor(
        gamesRequstInfo: IGames,
        protected gamesCatalogService: GamesCatalogService,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected hooksService: HooksService,
        public readonly categories: Categories,
        public readonly merchants: Merchants,
        public readonly games: Games,
        private sorts?: IIndexing<IAllSortsItemResponse>,
    ) {
        this.data = gamesRequstInfo;
        this.init().catch((error): void => {
            const logObj: ILogObj = {
                code: '7.0.3',
                flog: {
                    error: error.message ? error.message : error,
                },
            };
            this.sendLog(logObj);
        });
    }

    /**
     * Games sort settings
     *
     * @returns {IGamesSortSetting}
     */
    public get gamesSortSetting(): IGamesSortSetting {
        return this.games.sortSetting;
    }

    /**
     * Games separate sort settings
     *
     * @returns {IGamesSeparateSortSetting}
     */
    public get gamesSeparateSortSetting(): IGamesSeparateSortSetting {
        return this.games.separateSortSettings;
    }

    /**
     * Get category settings
     *
     * @returns {IIndexing<ICategorySettings>}
     */
    public get defaultCategoryArchitecture(): boolean {
        return this.categories.defaultCategoryArchitecture;
    }

    /**
     * Get category settings
     *
     * @returns {IIndexing<ICategorySettings>}
     */
    public get architectureVersion(): ICategoriesSettings['architectureVersion'] {
        return this.categories.architectureVersion;
    }

    /**
     * Get category settings
     *
     * @returns {IIndexing<ICategorySettings>}
     */
    public getCategorySettings(): IIndexing<ICategorySettings> {
        return this.categories.categorySettings;
    }

    /**
     * Get games list by filter (used for search games)
     *
     * @param {IGamesFilterData} filter Filter for search games
     * @returns {Game[]} Gammes list
     */
    public getGameList(filter?: IGamesFilterData): Game[] {
        const includeCategories = filter?.categories || [];
        const excludeCategories = filter?.excludeCategories || [];
        const includeMerchants = filter?.merchants || [];
        const excludeMerchants = filter?.excludeMerchants || [];
        const gameIds = filter?.ids;
        const withFreeRounds = filter?.withFreeRounds;
        const includeSportsbooks = filter?.includeSportsbooks;
        const parentCategory = filter?.parentCategory;

        let searchQuery = filter?.searchQuery || '';
        let gameList: Game[] = _concat(
            includeSportsbooks ? this.sportsbooks : [],
            this.games.availableGames,
        );

        if (includeCategories.length) {
            let categories: CategoryModel[] = [];
            if (parentCategory) {
                categories = _filter(this.getCategoriesBySlugs(includeCategories), (category: CategoryModel) => {
                    return category.parentCategory?.slug === parentCategory;
                });
            } else {
                categories = this.getCategoriesBySlugs(includeCategories);
            }

            gameList = this.getGamesByCategories(categories);

            if (!searchQuery && categories.length > 1) {
                if (this.games.useSeparateSorts) {
                    GamesHelper.sortGamesGeneral(gameList, this.sorts, {
                        sortSetting: this.games.separateSortSettings,
                        country: this.configService.get('appConfig.country'),
                        language: this.translateService.currentLang || 'en',
                    });
                } else {
                    GamesHelper.sortGames(gameList, {
                        sortSetting: this.games.sortSetting,
                        country: this.configService.get('appConfig.country'),
                        language: this.translateService.currentLang || 'en',
                    });
                }
            }
        }

        if (excludeCategories.length) {
            const exclCategoryIds: number[] = [];

            _forEach(excludeCategories, (exclCategory: string) => {
                const exclCategoryId = GamesHelper.getCategoryIdByName(exclCategory);
                if (exclCategoryId) {
                    exclCategoryIds.push(exclCategoryId);
                }
            });

            gameList = this.filterGamesByCategoriesIds(gameList, exclCategoryIds);
        }

        if (includeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return _includes(includeMerchants, item.merchantID)
                    || _includes(includeMerchants, item.subMerchantID);
            });
        }

        if (excludeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return !this.merchants.isExcludeMerchant(excludeMerchants, item.merchantID, item.subMerchantID);
            });
        }

        if (searchQuery) {
            searchQuery = searchQuery.replace(/[!()+\\]/g, '\\$&');
            let result = this.games.sortNameByRegExp(searchQuery, gameList);

            if (!result.length && this.games.searchByCyrillicLetters) {
                result = this.games.sortNameByRegExp(this.games.replaceCyrillicChars(searchQuery), gameList);
            }

            gameList = result;
        }

        if (_size(gameIds)) {
            gameList = _filter(gameList, (game: Game): boolean => {
                return _includes(gameIds, game.ID);
            });
        }

        if (withFreeRounds) {
            gameList = _filter(gameList, (game: Game): boolean => {
                return game.withFreeRounds;
            });
        }

        return gameList;
    }

    /**
     * Filter games by search string and can use this string to find providers
     *
     * @param searchString string
     * @param showMerchantsFirst boolean
     * @returns Game[]
     */
    public searchByQuery(searchString: string, showMerchantsFirst: boolean = false): Game[] {
        if (searchString.length < 3) {
            return [];
        };

        searchString = searchString.toLowerCase().replace(/\s+/, ' ');
        const queries: string[] = searchString.split(' ');
        let result: Game[] = [];

        const merchantsIds: number[] = this.games.filterItems<MerchantModel, number>({
            collection: this.merchants.availableMerchants,
            getItemName: (item: MerchantModel): string => item.alias,
            searchString,
            queries,
            getPushItem: (item: MerchantModel): number => item.id,
        });

        result = this.games.filterItems<Game, Game>(this.games.generateParams({
            searchString,
            queries,
            merchantsIds,
            showMerchantsFirst,
        }));

        if (!result.length && this.games.searchByCyrillicLetters) {
            const replacedString: string = this.games.replaceCyrillicChars(searchString);

            if (replacedString !== searchString) {
                result = this.games.filterItems<Game, Game>(this.games.generateParams({
                    searchString: replacedString,
                    queries,
                    merchantsIds,
                    showMerchantsFirst,
                }));
            }
        }

        return result;
    }

    /**
     * Get all categories
     *
     * @returns {CategoryModel[]} Categories list
     */
    public getCategories(): CategoryModel[] {
        return this.categories.projectCategories;
    }

    /**
     * Get all enabled sportsbooks
     *
     * @returns {Game[]} sportsbooks list
     */
    public getSportsbooks(): Game[] {
        return this.sportsbooks;
    }

    /**
     * Get categories by slugs
     *
     * @param {string[]} slugs Category slugs
     * @param {boolean} onlyAvailable Search by all categories or only by available
     * @returns {CategoryModel[]} Categories list
     */
    public getCategoriesBySlugs(slugs: string[], onlyAvailable: boolean = false): CategoryModel[] {
        return this.categories.getCategoriesBySlugs(slugs, onlyAvailable);
    }

    /**
     * Get available category by slug or by slugs array
     *
     * @param {string | string[]} slug
     * @returns {CategoryModel}
     */
    public getCategoryBySlug(slug: string | string[], byDefaultCategories?: boolean): CategoryModel {
        return this.categories.getCategoryBySlug(slug, byDefaultCategories);
    }

    /**
     * Sort categories
     *
     * @param {CategoryModel[]} categories Category list
     * @returns {CategoryModel[]} Sorted category list
     */
    public sortCategories(categories: CategoryModel[]): CategoryModel[] {
        return this.categories.sortCategories(categories);
    }

    /**
     * Get all game merchants
     *
     * @returns {MerchantModel[]} Merchants list
     */
    public getMerchants(): MerchantModel[] {
        return this.merchants.allMerchants;
    }

    /**
     * Get available merchants (used country restriction of games)
     *
     * @returns {MerchantModel[]} Available merchants
     */
    public getAvailableMerchants(): MerchantModel[] {
        return this.merchants.availableMerchants;
    }

    /**
     * Get available categories (which have games and not hidden)
     *
     * @returns {CategoryModel[]} Categories list
     */
    public getAvailableCategories(): CategoryModel[] {
        return this.categories.availableCategories;
    }

    /**
     * Get game by id (Search by available games, restricted games not will be found)
     *
     * @param {string} id
     * @param {number} tableId
     * @returns {Game}
     */
    public getGameById(id: number, tableId?: number): Game {
        return _find(
            this.games.availableGames,
            tableId ? {tableID: `${id}:${tableId}`} : {ID: id},
        );
    }

    /**
     * Get game (Search by available games, restricted games not will be found)
     *
     * @param {string} merchantID Game merchant id
     * @param {string} launchCode Game launch code
     * @param {boolean} sportsbook Game is sportsbook or not
     * @param {boolean} byAllGames Try find game by allGames list or by availableGames list
     * @returns {Game}
     */
    public getGame(
        merchantID: number,
        launchCode: string,
        isSportsbook: boolean = false,
        byAllGames: boolean = false,
    ): Game {

        let gamesList: Game[] = [];
        if (isSportsbook) {
            gamesList = this.sportsbooks;
        } else {
            gamesList = byAllGames ? this.games.allGames : this.games.availableGames;
        }
        return _find(gamesList, (game: Game): boolean => {
            return _includes([game.merchantID, game.subMerchantID, game.launchMerchantID], merchantID)
                && game.launchCode === launchCode;
        });
    }

    /**
     * Get jackpot games (Search by available games, restricted games not will be found)
     *
     * @returns {Game[]} Jackpot games
     */
    public getJackpotGames(): Game[] {
        return _filter(this.games.availableGames, (game: Game) => {
            return !!game.jackpot;
        });
    }

    /**
     * Get games by categories
     *
     * @param {CategoryModel} categories Game categories
     * @returns {Game[]} Filtered games list
     */
    public getGamesByCategories(categories: CategoryModel[]): Game[] {
        const games: Game[] = _reduce(categories, (acc: Game[], category: CategoryModel) => {
            return acc.concat(category.games);
        }, []);
        return _uniqBy(games, (game: Game) => game.ID.toString() + game.launchCode);
    }

    /**
     * Get merchant by name (for name used menuId)
     *
     * @param {string} merchantName Merchant name
     * @returns {MerchantModel}
     */
    public getMerchantByName(merchantName: string): MerchantModel {
        return _find(this.getAvailableMerchants(), {menuId: merchantName});
    }

    /**
     * Get merchant by alias
     *
     * @param {string} merchantAlias
     * @returns {MerchantModel}
     */
    public getMerchantByAlias(merchantAlias: string): MerchantModel {
        return _find(this.merchants.allMerchants, {alias: merchantAlias});
    }

    /**
     *
     * @param {IJackpot[]} jackpots
     */
    public loadJackpots(jackpots: IJackpot[]): void {
        if (!this.games.overrideJackpots) {
            return;
        }
        const categoryId = GamesHelper.getCategoryIdByName('jackpots');
        const useRealJackpots: boolean = this.configService.get<boolean>('$base.games.jackpots.useRealJackpots');


        _forEach(jackpots, jackpot => {
            const game: Game = this.getGame(_toNumber(jackpot.MerchantID), jackpot.LaunchCode);
            if (game && jackpot.amount > 0) {
                game.jackpot = jackpot.amount;
                if (!_includes(game.categoryID, categoryId)) {
                    game.categoryID.push(categoryId);
                }
            }
        });

        const games: Game[] = this.getJackpotGames();
        const category: CategoryModel = _find(this.categories.projectCategories, (category) => {
            return category.slug === 'jackpots';
        });

        if (category) {
            if (this.categories.categorySettings && !useRealJackpots) {
                const gameBlocks: IGameBlock[] = category.gameBlocks;

                _forEach(gameBlocks, (gameBlock: IGameBlock) => {
                    const gamesList: Game[] = this.filterGames([category, gameBlock.category], games);
                    if (gamesList.length) {
                        gameBlock.games = gamesList;
                    }
                });
            } else {
                category.setGames(games);
            }
            category.setReady();
        }
    }

    /**
     * Mark favorites games
     *
     * @param {IFavourite[]} favourites
     */
    public loadFavourites(favourites: IFavourite[]): void {
        _forEach(favourites, favourite => {
            const game: Game = this.getGameById(_toNumber(favourite.game_id));
            if (game) {
                game.isFavourite = true;
            }
        });
    }

    /** Filters games list by categories Ids
     *
     * @param {Game[]} games
     * @param {number[]} catIds
     * @param {TGamesFilterMod} mod - exclude filtering, if undefined
     */
    public filterGamesByCategoriesIds(games: Game[], catIds: number[], mod?: TGamesFilterMod): Game[] {

        switch (mod) {
            case 'include':
                return games.filter((item: Game): boolean => {
                    let rv: boolean = false;
                    for (const id of catIds) {
                        rv = rv || _includes(item.categoryID, id);
                    }
                    return rv;
                });
            default:
                return games.filter((item: Game): boolean => {
                    let rv: boolean = true;
                    for (const exclCategoryId of catIds) {
                        rv = rv && (!_includes(item.categoryID, exclCategoryId));
                    }
                    return rv;
                });
        }
    }

    protected sendLog(logObj: ILogObj): void {
        GlobalDeps.logService.sendLog(logObj);
    }

    protected async init(): Promise<void> {
        this.ready = this.readyStatus.promise;

        const menuService: MenuService = await this.injectionService.getService<MenuService>('menu.menu-service');
        this.existMenuSettings = await menuService.existFundistMenuSettings();

        this.optimizationService = await this.injectionService
            .getExternalService<OptimizationService>('optimization');

        await this.processFetchedGamesCatalog(this.data, this.sorts);
        this.availableGamesHandler();
        this.readyStatus.resolve();
    }

    /**
     * Change available games (some games blocks by country restrictions) after login/logout
     */
    protected availableGamesHandler(): void {
        this.userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        this.userProfile$
            .pipe(
                skipWhile(v => !v),
            )
            .subscribe((userProfile) => {
                if (this.merchants.disabledMerchantsOptions || this.userCountry !== userProfile.countryCode) {
                    this.updateAvailableGamesAndMerchants(userProfile.countryCode);
                }
            });
    }

    /**
     * Update available games and merchants using country restriction of games
     *
     * @param {string} userCountry Country from user profile
     */
    protected updateAvailableGamesAndMerchants(userCountry: string): void {
        this.userCountry = userCountry;

        const country: string = this.configService.get<string>('appConfig.country') || null;
        const restrictCountries: string[] = [country, this.userCountry];
        const disabledMerchants: number[] = this.merchants.disabledMerchants;

        this.games.setAvailableGames(
            disabledMerchants,
            restrictCountries,
        );

        this.merchants.setAvailableMerchants(this.games.availableGames);

        _forEach(this.categories.projectCategories, (category: CategoryModel): void => {
            category.updateAvailableGames(this.games.availableGames);
        });

        this.eventService.emit({
            name: gamesEvents.UPDATED_AVAILABLE_GAMES,
            data: this.games.availableGames,
        });
    }

    /**
     * Filter games
     *
     * @param {CategoryModel} categories Game categories
     * @returns {Game[]} Filtered games list
     */
    protected filterGames(includeCategories: CategoryModel[], gameList?: Game[]): Game[] {
        const categoryIds = _reduce(includeCategories, (ids: number[], category) => {
            if (category.slug !== 'casino') {
                ids.push(category.id);
            }
            return ids;
        }, []);

        return _filter(gameList || this.getGameList(), (game: Game) => {
            for (const categoryId of categoryIds) {
                if (!_includes(game.categoryID, categoryId)) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     *
     * @param {IGames} response
     */
    protected async processFetchedGamesCatalog(data: IGames, sorts: IIndexing<IAllSortsItemResponse>): Promise<void> {
        this.categories.allCategories = [];
        this.categories.availableCategories = [];

        const response: IGames = _cloneDeep(data);
        if (!_get(response, 'games.length')) {
            return;
        }

        GamesHelper.reset();

        /***********************************************************************************************************
         * MERCHANTS
         **********************************************************************************************************/
        const mapMerchants = GamesHelper.mapMerchants(
            response.merchants,
            _assign({},
                this.configService.get<IIndexing<string>>('appConfig.siteconfig.merchantNameAliasesMap') || {},
                this.configService.get<IIndexing<string>>('$games.merchantNameAliasesMap') || {},
            ));
        this.merchants.setMerchants(mapMerchants.merchantsArray);

        /***********************************************************************************************************
         * CATEGORIES
         **********************************************************************************************************/

        response.categories = _concat(this.categories.specialCategories, response.categories);

        if (this.categories.renamedSlugs) {
            response.categories.forEach((item: ICategory) => {
                item.Slug = this.categories.transformSlug(item.Slug);
            });
        }

        CategoryModel.language = this.translateService.currentLang || 'en';
        CategoryModel.country = this.configService.get('appConfig.country');

        const categories = GamesHelper.mapCategories(
            response.categories,
            this.categories.categorySettings,
            this.games.sortSetting,
            sorts,
            this.games.separateSortSettings,
            this.games.useSeparateSorts,
            this.categories.defaultSpecialCategories,
            this.categories.defaultParentCategories,
        );
        this.categories.allCategories = this.sortCategories(categories);

        /***********************************************************************************************************
         * COUNTRIES RESTRICTIONS
         **********************************************************************************************************/
        this.games.setRestrictions(response.countriesRestrictions);

        if (Games.allowGameCurrency) {
            this.games.setMerchantsCurrencies(response.merchantsCurrencies);
        }
        /***********************************************************************************************************
         * GAMES
         **********************************************************************************************************/
        const resultGames: Game[] = [];
        const sportsbookMerchants: number[] = this.configService.get<number[]>('$games.sportsbookMerchants');

        Game.enabledMerchants = this.merchants.allMerchants;

        for (const item of response.games) {
            const merchantId: string = !!item.SubMerchantID ? item.IDMerchantsCurrencies : item.MerchantID ;

            if (this.optimizationService?.useSlimImages) {
                item.Image = this.optimizationService.getSlimImage(item.Image);
            }

            const game = new Game(
                {parentModel: 'Catalog', method: 'processFetchedGamesCatalog'},
                item,
                this.router,
                this.configService,
                item.IDMerchantsCurrencies
                    ? this.games.merchantsCurrencies[`${merchantId}=>${item.IDMerchantsCurrencies}`]
                    : this.games.merchantsCurrencies[merchantId],
            );

            await this.hooksService.run<Game>(
                gamesCatalogHooks.modifyGame,
                game,
            );

            if (!_isArray(game.categoryID)) {
                continue;
            }

            const merchantName: string = game.getMerchantName();
            if (!merchantName) {
                continue;
            }
            GamesHelper.fillGamesByCategoriesMerchants(game);

            if (this.merchants.isExcludeMerchant(sportsbookMerchants, game.merchantID, game.subMerchantID)) {
                this.sportsbooks.push(game);
            } else {
                resultGames.push(game);
            }
        }

        this.games.setGames(resultGames);

        this.prepareCategories();
        this.updateAvailableGamesAndMerchants(this.userCountry);
    }

    protected prepareCategories(): void {
        const parents = this.categories.parentCategories;
        _forEach(this.categories.allCategories, (category: CategoryModel) => {
            if (_includes(parents, category.slug)) {
                category.setAsParent();
            }
        });

        _forEach(this.categories.allCategories, (category: CategoryModel) => {
            if (_includes(parents, category.slug) && !category.initedWithMenu) {
                category.setMenu('main-menu');
            }
        });

        const excludeSettings: IExcludeCategories = this.categories.exclude;
        if (excludeSettings?.bySlug) {
            this.categories.allCategories = _filter(this.categories.allCategories, (category: CategoryModel) => {
                return !_includes(excludeSettings.bySlug, category.slug);
            });
        }

        const hideSettings = this.categories.hideSettings?.bySlug;
        if (hideSettings) {
            _forEach(this.categories.allCategories, (category: CategoryModel): void => {
                if (_includes(hideSettings, category.slug)) {
                    category.isHidden = true;
                }
            });
        }

        const sortSettings: ISortCategories = this.categories.sortSettings;
        if (sortSettings?.byDefault) {
            _forEach(this.categories.allCategories, (category: CategoryModel) => {
                const defaultSort: number = _get(sortSettings.byDefault, category.slug);
                if (_isNumber(defaultSort) && !category.initedWithDefaultSort) {
                    category.setDefaultSort(defaultSort);
                }
            });
        }

        if (this.categories.categorySettings && this.existMenuSettings) {
            this.categories.defaultCategoryArchitecture = false;
        }

        const prepareCategoriesList: CategoryModel[] = this.categories.prepareCategoriesList({
            allCategories: this.categories.allCategories,
            categorySettings: this.categories.categorySettings,
            availableGames: this.games.availableGames,
            getCategoryBySlug: this.getCategoryBySlug.bind(this),
        });

        this.categories.projectCategories = this.sortCategories(prepareCategoriesList);

        this.categories.setGamesForCategories({
            categories: this.categories.projectCategories,
            categorySettings: this.categories.categorySettings,
            filterGames: this.filterGames.bind(this),
            getGameList: this.getGameList.bind(this),
        });

        _forEach(this.categories.projectCategories, (category) => {
            if (category.isJackpots && this.games.overrideJackpots) {
                return;
            } else {
                category.setReady();
            }
        });

        this.categories.availableCategories = _filter(this.categories.projectCategories, (category: CategoryModel) => {
            return !category.isHidden;
        });
    }

}

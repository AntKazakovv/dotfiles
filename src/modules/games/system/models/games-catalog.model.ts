import {UIRouter} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';
import {
    ICategorySettings,
    IFromLog,
    IMenu,
} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    ICatalogTreeItem,
    ICategory,
    IExcludeCategories,
    IFavourite,
    IGames,
    IJackpot,
    IRestrictions,
    ISearchFilter,
    IGameBlock,
    ISortCategories,
    ISupportedItem,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

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
import _isString from 'lodash-es/isString';
import _isUndefined from 'lodash-es/isUndefined';
import _orderBy from 'lodash-es/orderBy';
import _reduce from 'lodash-es/reduce';
import _size from 'lodash-es/size';
import _toNumber from 'lodash-es/toNumber';
import _union from 'lodash-es/union';
import _uniq from 'lodash-es/uniq';
import _uniqBy from 'lodash-es/uniqBy';

export class GamesCatalog extends AbstractModel<IGames> {

    protected games: Game[];
    protected sportsbooks: Game[] = [];
    protected categories: CategoryModel[] = [];
    protected projectCategories: CategoryModel[] = [];
    protected merchants: MerchantModel[];
    protected restrictions: IRestrictions;
    protected availableCategories: CategoryModel[];
    protected supportedCategories: ISupportedItem[];
    protected supportedMerchants: ISupportedItem[];
    protected overrideJackpots: boolean;
    protected categorySettings: IIndexing<ICategorySettings>;
    protected menuSettings: IMenu;
    protected specialCategories: ICategory[] = [
        {
            ID: '-1',
            Name: {
                en: gettext('Last played'),
            },
            Trans: {
                en: gettext('Last played'),
            },
            Tags: [],
            menuId: 'lastplayed',
            Slug: 'lastplayed',
            CSort: '0',
            CSubSort: '9999998',
        },
        {
            ID: '-2',
            Name: {
                en: gettext('My favourites'),
            },
            Trans: {
                en: gettext('My favourites'),
            },
            Tags: [],
            menuId: 'favourites',
            Slug: 'favourites',
            CSort: '0',
            CSubSort: '9999999',
        },
        {
            ID: '-3',
            Name: {
                en: gettext('Casino'),
            },
            Trans: {
                en: gettext('Casino'),
            },
            Tags: [''],
            menuId: 'casino',
            Slug: 'casino',
            CSort: '0',
            CSubSort: '0',
        },
    ];

    constructor(
        from: IFromLog,
        _data: IGames,
        protected gamesCatalogService: GamesCatalogService,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected eventService: EventService,
    ) {
        super({from: _assign({model: 'GamesCatalog'}, from)});
        this.data = _data;
        this.overrideJackpots = !this.configService.get<boolean>('$games.categories.useFundistJackpots');
        this.categorySettings = this.configService.get('appConfig.categories');
        this.menuSettings = this.configService.get('appConfig.menuSettings');
        this.processFetchedGamesCatalog(this.data);
    }

    public isSpecialCategory(category: CategoryModel): boolean {
        return !!_find(this.specialCategories, (item: ICategory) => {
            return category.slug === item.Slug;
        });
    }

    /**
     *
     * @param {IGamesFilterData} filter
     * @returns {Game[]}
     */
    public getGameList(filter?: IGamesFilterData): Game[] {
        const includeCategories = filter?.categories || [];
        const excludeCategories = filter?.excludeCategories || [];
        const includeMerchants = filter?.merchants || [];
        const excludeMerchants = filter?.excludeMerchants || [];
        const searchQuery = filter?.searchQuery || '';
        const gameIds = filter?.ids;
        let gameList: Game[] = _concat([], this.games);

        if (includeCategories.length) {
            const categories: CategoryModel[] = this.getCategoriesBySlugs(includeCategories);
            gameList = this.getGamesByCategories(categories);
        }

        if (excludeCategories.length) {
            const exclCategoryIds: number[] = [];

            _forEach(excludeCategories, (exclCategory: string) => {
                const exclCategoryId = GamesHelper.getCategoryIdByName(exclCategory);
                if (exclCategoryId) {
                    exclCategoryIds.push(exclCategoryId);
                }
            });

            gameList = gameList.filter((item: Game): boolean => {
                let rv = true;
                for (const exclCategoryId of exclCategoryIds) {
                    rv = rv && (!_includes(item.categoryID, exclCategoryId));
                }
                return rv;
            });
        }

        if (includeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return _includes(includeMerchants, item.merchantID)
                    || _includes(includeMerchants, item.subMerchantID);
            });
        }

        if (excludeMerchants.length) {
            gameList = gameList.filter((item: Game) => {
                return !this.isExcludeMerchant(excludeMerchants, item.merchantID, item.subMerchantID);
            });
        }

        if (searchQuery) {
            gameList = this.sortNameByRegExp(searchQuery, gameList);
        }

        if (_size(gameIds)) {
            gameList = _filter(gameList, (game: Game): boolean => {
                return _includes(gameIds, game.ID);
            });
        }

        return gameList;
    }

    /**
     *
     * @returns {CategoryModel[]}
     */
    public getCategories(): CategoryModel[] {
        return this.projectCategories;
    }

    /**
     * Get categories by menu ids
     *
     * @param {string[]} menuIds
     * @returns {CategoryModel[]}
     */
    public getCategoriesBySlugs(slug: string[]): CategoryModel[] {
        return _filter(this.getCategories(), (category: CategoryModel) => {
            return _includes(slug, category.slug);
        });
    }

    /**
     * Get available category by slug or by slugs array
     *
     * @param {string | string[]} slug
     * @returns {CategoryModel}
     */
    public getCategoryBySlug(slug: string | string[], byDefaultCategories?: boolean): CategoryModel {

        if (!slug) {
            return;
        }
        const slugs: string[] = _isString(slug) ? [slug] : slug;
        const categoryList = byDefaultCategories ? this.categories : this.projectCategories;

        for (const categorySlug of slugs) {
            const category = _find(categoryList, (category: CategoryModel) => {
                return category.slug === categorySlug;
            });
            if (category) {
                return category;
            }
        }
    }

    /**
     * Sort categories
     *
     * @param {CategoryModel[]} categories
     * @returns {CategoryModel[]}
     */
    public sortCategories(categories: CategoryModel[]): CategoryModel[] {
        return GlobalHelper.sortByNumber<CategoryModel>(categories, 'sort', false);
    }

    /**
     *
     * @returns {MerchantModel[]}
     */
    public getMerchants(): MerchantModel[] {
        return this.merchants;
    }

    /**
     *
     * @returns {MerchantModel[]}
     */
    public getAvailableMerchants(): MerchantModel[] {
        return GamesHelper.availableMerchants;
    }

    /**
     *
     * @returns {CategoryModel[]}
     */
    public getAvailableCategories(): CategoryModel[] {
        return this.projectCategories;
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
            if (
                !_isUndefined(subcategory) &&
                !!subcategory &&
                GamesHelper.mapping.byCategory.hasOwnProperty(subcategory)
            ) {
                return GamesHelper.mapping.byCategory[subcategory].title.hasOwnProperty(language) ?
                    GamesHelper.mapping.byCategory[subcategory].title[language] :
                    GamesHelper.mapping.byCategory[subcategory].title.en;
            }

            if (GamesHelper.mapping.merchantNameToTitleMapping.hasOwnProperty(category)) {
                return GamesHelper.mapping.merchantNameToTitleMapping[category];
            }
        }

        if (type === 'category') {
            if (
                !_isUndefined(subcategory) &&
                !!subcategory &&
                GamesHelper.mapping.categoryNameToTitleMapping.hasOwnProperty(subcategory)
            ) {
                return GamesHelper.mapping.categoryNameToTitleMapping[subcategory];
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
    public getGame(merchantID: number, launchCode: string, isSportsbook: boolean = false): Game {
        const gamesList: Game[] = isSportsbook ? this.sportsbooks : this.games;
        return _find(gamesList, {merchantID, launchCode});
    }

    public getJackpotGames(): Game[] {
        return _filter(this.games, (game: Game) => {
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
        return _uniqBy(games, 'ID');
    }

    /**
     *
     * @param {string} merchantName
     * @returns {MerchantModel}
     */
    public getMerchantByName(merchantName: string): MerchantModel {
        return _find(this.merchants, {menuId: merchantName});
    }

    /**
     *
     * @param {string} merchantId
     * @param {string} launchCode
     * @returns {string}
     */
    public getGameName(merchantId: number, launchCode: string): string {
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
        if (!this.overrideJackpots) {
            return;
        }
        const categoryId = GamesHelper.getCategoryIdByName('jackpots');

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
        const category: CategoryModel = _find(this.projectCategories, (category) => {
            return category.slug === 'jackpots';
        });

        if (category) {
            if (this.categorySettings) {
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
    protected processFetchedGamesCatalog(data: IGames): void {
        this.merchants = [];
        this.categories = [];
        this.availableCategories = [];

        const response: IGames = _cloneDeep(data);
        if (!_get(response, 'games.length')) {
            return;
        }

        GamesHelper.reset();

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
        response.categories = _concat(this.specialCategories, response.categories);

        const categories = GamesHelper.mapCategories(response.categories, this.categorySettings);
        this.categories = this.sortCategories(categories);

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
        const sportsbookMerchants: number[] = this.configService.get<number[]>('$games.sportsbookMerchants');

        for (const item of response.games) {
            const game = new Game(
                {parentModel: 'GamesCatalog', method: 'processFetchedGamesCatalog'},
                item,
                this.router,
                this.configService,
            );

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
            GamesHelper.fillGamesByCategoriesMerchants(game, this.availableCategories);

            if (this.isExcludeMerchant(sportsbookMerchants, game.merchantID, game.subMerchantID)) {
                this.sportsbooks.push(game);
            } else {
                resultGames.push(game);
            }
        }

        this.availableCategories = this.sortCategories(this.availableCategories);
        this.games = _orderBy(resultGames, (game: Game) => _toNumber(game.sort), 'desc');
        this.prepareCategories();
    }

    protected isExcludeMerchant(excludeMerchants: number[], id: number, subID: number): boolean {
        return _includes(excludeMerchants, id) || _includes(excludeMerchants, subID);
    }

    protected prepareCategories(): void {
        const parents = this.configService.get<string[]>('$games.categories.parents') || [];

        _forEach(this.categories, (category: CategoryModel) => {
            if (_includes(parents, category.slug) && !category.initedWithMenu) {
                category.setMenu('main-menu');
            }
        });

        const excludeSettings: IExcludeCategories = this.configService.get<IExcludeCategories>('$games.categories.exclude');
        if (excludeSettings) {
            this.categories = _filter(this.categories, (category: CategoryModel) => {
                if (excludeSettings.bySlug) {
                    return !_includes(excludeSettings.bySlug, category.slug);
                }
            });
        }

        const sortSettings: ISortCategories = this.configService.get<ISortCategories>('$games.categories.sort');
        if (sortSettings?.byDefault) {
            _forEach(this.categories, (category: CategoryModel) => {
                const defaultSort: number = _get(sortSettings.byDefault, category.slug);
                if (_isNumber(defaultSort) && !category.initedWithDefaultSort) {
                    category.setDefaultSort(defaultSort);
                }
            });
        }

        if (this.categorySettings && this.menuSettings) {

            const categories: CategoryModel[] = _filter(this.categories, (category: CategoryModel) => {
                return !!this.categorySettings[category.slug] || category.isSpecial;
            });

            this.projectCategories = categories;
            this.configureCategoriesView(this.projectCategories);

        } else {

            const parentCategories: CategoryModel[] = _filter(this.categories, (category: CategoryModel) => {
                return category.isParent;
            });

            const mainParentCategory: CategoryModel = this.getCategoryBySlug(['casino', 'livecasino', 'tablegames'], true);

            const otherCategories: CategoryModel[] = _filter(parentCategories, (category) => {
                return category.slug !== mainParentCategory?.slug && !category.isSpecial;
            });

            _forEach(otherCategories, (category) => {
                const gamesList: Game[] = _filter(this.games, (game: Game) => {
                    return game.hasCategory(category);
                });
                category.setGames(gamesList);
                category.sortGames();
            });

            let gamesList: Game[] = this.games;
            if (mainParentCategory && mainParentCategory.slug !== 'casino') {
                gamesList = this.getGamesByCategories([mainParentCategory]);
            }
            mainParentCategory.setGames(gamesList);

            const childCategories: CategoryModel[] = _filter(this.categories, (category: CategoryModel) => {
                return !category.isParent;
            });

            const availableChildCategories: CategoryModel[] = [];

            _forEach(childCategories, (category: CategoryModel) => {

                const games: Game[] = _filter(this.games, (game: Game) => {
                    return _includes(game.categoryID, category.id);
                });

                if (games.length) {
                    const newChildCategory: CategoryModel = _cloneDeep(category);
                    newChildCategory.setParentCategory(mainParentCategory);
                    newChildCategory.setGames(_orderBy(games, (game: Game) => game[category.name + 'Sorted'] || 0, 'desc'));
                    availableChildCategories.push(newChildCategory);
                }
            });

            mainParentCategory.setChildCategories(availableChildCategories);
            this.projectCategories = this.sortCategories(_union(parentCategories, availableChildCategories));
            this.configureCategoriesView(this.projectCategories);
        }

        _forEach(this.projectCategories, (category) => {
            if (category.isJackpots && this.overrideJackpots) {
                return;
            } else {
                category.setReady();
            }
        });
    }

    protected configureCategoriesView(categories: CategoryModel[]): void {
        _forEach(categories, (mainCategory) => {
            const settings = _get(this.categorySettings, mainCategory.slug);
            if (settings) {
                const games: Game[] = this.filterGames([mainCategory]);
                mainCategory.setGames(games);

                if (settings.view === 'blocks' || settings.view === 'restricted-blocks') {
                    const gameBlocks: IGameBlock[] = _reduce(categories, (blocks: IGameBlock[], category: CategoryModel) => {
                        if (category.slug !== mainCategory.slug) {
                            const filterByCategries: CategoryModel[] = [category];
                            if (mainCategory.slug !== 'casino') {
                                filterByCategries.push(mainCategory);
                            }

                            const games: Game[] = this.filterGames(filterByCategries);
                            if (games.length) {
                                blocks.push({
                                    category: category,
                                    games: games,
                                    settings: settings?.blocks?.[category.slug],
                                });
                            }
                        }
                        return blocks;
                    }, []);
                    mainCategory.setGameBlocks(gameBlocks);
                }
            } else {
                const games: Game[] = this.filterGames([mainCategory]);
                if (games.length) {
                    mainCategory.setGames(games);
                }
            }
        });
    }

    protected sortNameByRegExp(searchQuery: string, gamesList: Game[]): Game[] {
        searchQuery = searchQuery.replace(/[!()+\\]/g, '\\$&');

        const arrays: IIndexing<ISearchFilter> = {
            completeMatch: {
                array: [],
                regExp: `^${searchQuery}[\\s]`,
            },
            firstMatch: {
                array: [],
                regExp: `[\\s]${searchQuery}[\\s]?$`,
            },
            secondMatch: {
                array: [],
                regExp: `[\\s]${searchQuery}`,
            },
            thirdMatch: {
                array: [],
                regExp: `${searchQuery}`,
            },
        };

        _forEach(arrays, (item: any) => {
            item.array = gamesList.filter((game: Game) => {
                return new RegExp(item.regExp, 'gi').test(game.name.en);
            });
        });

        return _uniq(_union(arrays.completeMatch.array,
            arrays.firstMatch.array,
            arrays.secondMatch.array,
            arrays.thirdMatch.array));
    }
}

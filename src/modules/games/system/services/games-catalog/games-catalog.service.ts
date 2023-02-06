import {Injectable, Injector} from '@angular/core';
import {
    UIRouter,
    UIRouterGlobals,
    RawParams,
    Transition,
    StateObject,
    TargetState,
} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {
    forkJoin,
    Observable,
    Subject,
    Subscription,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    map,
    take,
} from 'rxjs/operators';
import _startsWith from 'lodash-es/startsWith';
import _isString from 'lodash-es/isString';
import _isEqual from 'lodash-es/isEqual';
import _map from 'lodash-es/map';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _toNumber from 'lodash-es/toNumber';
import _size from 'lodash-es/size';
import _union from 'lodash-es/union';
import _forEach from 'lodash-es/forEach';
import _intersectionBy from 'lodash-es/intersectionBy';
import _uniqBy from 'lodash-es/uniqBy';
import _reduce from 'lodash-es/reduce';
import _first from 'lodash-es/first';

import {ICategorySettings} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    EventService,
    IEvent,
} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {
    IPragmaticPlaySettings,
    PragmaticPlayLiveService,
} from 'wlc-engine/modules/games/system/services/pragmatic-play-live/pragmatic-play-live.service';

import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {
    IGames,
    IJackpot,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {SpecialCategoriesGamesSlug} from 'wlc-engine/modules/games/system/config/games.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalog} from 'wlc-engine/modules/games/system/models/games-catalog.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {
    IPlayGameForRealCParams,
} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';
import {PragmaticLiveModel} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';
import {
    IFavourite,
    IGameParams,
    ILastPlayedGame,
    ILaunchInfo,
    IStartGameOptions,
    gamesEvents,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {ITournamentGames} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {
    TFreeRoundGames,
    TGamesWithFreeRounds,
} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    IAllSortsItemResponse,
    TAutoGamesSortResponse,
    TGamesSortResponses,
} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';
import {
    GamesSortEnum,
    SortTypeEnum,
} from 'wlc-engine/modules/games/system/interfaces/sorts.enums';

export interface ILaunchGameModal {
    show: boolean;
    deviceType?: DeviceType[];
    disableDemo?: boolean;
}

export interface ILaunchGameParams {
    demo?: boolean;
    modal?: ILaunchGameModal;
}

export interface IVerticalThumbsConfig {
    haveVideo: number[];
}

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    public readonly ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });
    public readonly gameThumpReady: Promise<void> = new Promise((resolve: () => void): void => {
        this.$gameThumpResolve = resolve;
    });
    public favourites: Game[] = [];

    public favoritesUpdated: Subject<void> = new Subject<void>();

    private searchBySpecialCats: boolean = true;
    private gamesCatalog: GamesCatalog;
    private onlyAuthSpecial: string[] = ['lastplayed', 'favourites', 'last-played'];
    private categoryMenus: string[] = [
        'main-menu',
        'category-menu',
    ];
    private deviceType: DeviceType;
    private verticalThumbsConfig: IVerticalThumbsConfig;
    private lastPlayed: Game[] = [];
    private pragmaticPlayLiveService: PragmaticPlayLiveService;
    private useRealJackpots: boolean;
    private useSeparateSorts: boolean;
    private sorts: IIndexing<IAllSortsItemResponse>;

    constructor(
        public configService: ConfigService,
        public router: UIRouter,
        public eventService: EventService,
        public translateService: TranslateService,
        protected dataService: DataService,
        protected uiRouter: UIRouterGlobals,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected logService: LogService,
        protected injector: Injector,
        protected injectionService: InjectionService,
    ) {
        this.init();
    }

    private $resolve: () => void;
    private $gameThumpResolve: () => void;
    private isMobile: boolean = false;

    public async init(): Promise<void> {
        await this.configService.ready;
        this.registerMethods();

        this.loadGames();

        this.useRealJackpots = this.configService.get<boolean>('$base.games.jackpots.useRealJackpots');
        this.useSeparateSorts = this.configService.get<boolean>('$games.sortsV2.use');

        const fetches: {
            games: Observable<IEvent<IData<IGames>>>,
            sorts?: Observable<IEvent<IData<IAllSortsItemResponse[]>>>
        } = {
            games: this.eventService.filter<IData<IGames>>({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }).pipe(take(1)),
        };

        if (this.useSeparateSorts) {
            fetches.sorts = this.eventService.filter<IData<IAllSortsItemResponse[]>>({
                name: gamesEvents.FETCH_GAME_SORTING_SUCCEEDED,
            }).pipe(take(1));

            this.loadGameSorts(GamesSortEnum.All);
        }

        forkJoin(fetches).subscribe(({games, sorts}) => {
            if (sorts) {
                this.sorts = this.sortsToDict(sorts.data.data);
            }
            this.gamesCatalog = new GamesCatalog(
                {service: 'GamesCatalogService', method: 'init'},
                games.data.data,
                this,
                this.translateService,
                this.configService,
                this.router,
                this.eventService,
                this.injectionService,
                this.sorts,
            );
            this.gamesCatalog.ready.then(() => {
                if (!this.gamesCatalog.getGameList().length) {
                    this.logService.sendLog({
                        code: '3.0.24',
                        from: {
                            service: 'GamesCatalogService',
                            method: 'init',
                        },
                    });
                }

                const PPL = this.getMerchantById(913);
                if (PPL && PPL.dgaUrl && PPL.casinoID) {
                    this.configService.set<IPragmaticPlaySettings>({
                        name: 'pragmaticPlaySettings',
                        value: {
                            dgaUrl: PPL.dgaUrl,
                            casinoId: PPL.casinoID,
                        },
                    });
                    this.pragmaticPlayLiveService = this.injector.get(PragmaticPlayLiveService);
                }
                this.$gameThumpResolve();
                this.$resolve();
                this.loadJackpots().then((): void => {
                    if (this.useRealJackpots) {
                        this.getJackpotGames();
                    }
                });
                this.getFavouriteGames();
            });
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog?.loadJackpots(data.data);
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_FAVOURITES_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog?.loadFavourites(data.data);
            this.favoritesUpdated.next();
        });

        this.eventService.filter({
            name: 'LOGIN',
        }).subscribe({
            next: () => {
                this.eventService.filter({
                    name: 'USER_PROFILE',
                }).pipe(first()).subscribe({
                    next: () => {
                        this.getFavouriteGames();
                    },
                });
            },
        });

        this.actionService.deviceType()
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                this.isMobile = type !== DeviceType.Desktop;
            });

        this.router.transitionService.onBefore(
            {to: this.catalogCriteria.bind(this)},
            (trans: Transition): TargetState => {
                return this.router.stateService.target('app.catalog', {
                    category: trans.paramsChanged<RawParams>().childCategory,
                });
            },
        );
    }

    /**
     * Get all enabled sportsbooks
     *
     * @returns {Game[]} sportsbooks list
     */
    public getSportsbooks(): Game[] {
        return this.gamesCatalog.getSportsbooks();
    }

    /**
     * Return Subscription to pragmatic play live
     *
     * @param game {Game} - game model
     * @param until {Subject} - takeUntil subject
     * @param observer {function} - observer
     * @returns Subscription
     */
    public async subscribePragmaticLive(
        game: Game,
        until: Subject<any>,
        observer: (pragmaticData: PragmaticLiveModel) => void,
    ): Promise<Subscription> {
        return this.pragmaticPlayLiveService?.subscribe(game, until, observer);
    }

    /**
     * Jackpot subscription
     *
     * @returns {Observable<JackpotModel[]>}
     */
    public get subscribeJackpots(): Observable<JackpotModel[]> {
        return this.dataService
            .getMethodSubscribe('games/jackpots')
            .pipe(
                filter(data => !!data),
                distinctUntilChanged((prev, curr): boolean => _isEqual(prev, curr)),
                map<IData, JackpotModel[]>((response) => {
                    if (!_isArray(response.data) || !response.data?.length) {
                        return [];
                    }

                    const filtred = _filter(response.data, (data: IJackpot) => data.amount > 0);

                    return _map(filtred, (data: IJackpot) => {
                        return new JackpotModel({service: 'GamesCatalogService', method: 'subscribeJackpots'}, data);
                    });
                }),
            );
    }


    /**
     *
     * @returns {Promise<void>}
     */
    public async loadGames(): Promise<void> {
        const request = 'games/games';
        try {
            await this.dataService.request(request);
        } catch (error) {
            this.logService.sendLog({
                code: '3.0.0',
                from: {
                    service: 'GamesCatalogService',
                    method: 'loadGames',
                },
            });
            this.$gameThumpResolve();
        }
    }

    /**
     * Get last games
     *
     * @returns {Promise<Game[]>} Last games list
     */
    public async getLastGames(): Promise<Game[]> {
        return this.lastPlayed = await this.loadSpecialCategoryGames<ILastPlayedGame>(
            'lastGames',
            (item: ILastPlayedGame) => item.ID,
        );
    }

    /**
     * Get favorite games
     *
     * @returns {Promise<Game[]>}
     */
    public async getFavouriteGames(): Promise<Game[]> {
        return this.favourites = await this.loadSpecialCategoryGames<IFavourite>(
            'favorites',
            (item: IFavourite) => String(item.game_id),
        );
    }

    /**
     * Get Jackpot games
     *
     * @returns {Promice<Game[]>}
     */
    public async getJackpotGames(): Promise<Game[]> {

        return await this.subscribeJackpots
            .pipe(
                first(),
                map<IData, Game[]>((response: IData): Game[] => {
                    let result: Game[] = [];
                    _forEach(response, ({launchCode, merchantID, amount, currency}: JackpotModel): void => {
                        const game: Game = this.getGame(merchantID, launchCode);
                        if (game) {
                            game.jackpotAmount = {amount, currency};
                            result.push(game);
                        }
                    });

                    return _uniqBy(result, (game: Game): number => game.ID);
                }),
            )
            .toPromise();
    }

    /**
     * Remove or add game to favorites
     *
     * @param {string} ID
     * @returns {Promise<boolean>}
     */
    public async toggleFavourites(ID: number): Promise<boolean> {
        if (!this.configService.get('$user.isAuthenticated')) {
            throw new Error('is not authenticated');
        }

        let response: IData = await this.dataService.request({
            name: 'addFavourite',
            system: 'games',
            url: `/favorites/${ID}`,
            type: 'POST',
        });
        const game: Game = this.gamesCatalog.getGameById(ID);
        if (game) {
            game.isFavourite = !!response.data.favorite;
            if (game.isFavourite) {
                this.favourites.push(game);
            } else {
                this.favourites = this.favourites.filter((item) => item.ID !== game.ID);
            }
        }
        this.favoritesUpdated.next();
        return !!response.data.favorite;
    }

    /**
     * Sort categories (used desc order)
     *
     * @param {CategoryModel[]} categories
     * @returns {CategoryModel[]}
     */
    public sortCategories(categories: CategoryModel[]): CategoryModel[] {
        return this.gamesCatalog.sortCategories(categories);
    }

    /**
     * Get game launch params
     *
     * @param {IGameParams} options
     * @returns {Promise<ILaunchInfo>}
     */
    public async getLaunchParams(options: IGameParams): Promise<ILaunchInfo> {
        return (await this.dataService.request('games/gameLaunchParams', {
            ...options,
            demo: options.demo ? 1 : 0,
        }) as IData).data;
    }

    /**
     * Get games by state
     *
     * @returns {Promise<Game[]>}
     */
    public async getGamesByState(): Promise<Game[]> {
        const parentCategory = this.getParentCategoryByState();
        const childCategory = this.getChildCategoryByState();

        let games = [];
        if (!this.catalogOpened()) {
            games = this.getGameList();
        } else if (parentCategory?.slug == 'lastplayed') {
            games = await this.getLastGames();
        } else if (parentCategory?.slug == 'favourites') {
            games = await this.getFavouriteGames();
        } else if (this.useRealJackpots && parentCategory?.slug == 'jackpots') {
            games = await this.getJackpotGames();
        } else {
            if (childCategory) {
                await childCategory.isReady;
                games = childCategory.games;
            } else if (parentCategory) {
                await parentCategory.isReady;
                games = parentCategory.games;
            }
        }
        return games;
    }

    /**
     * Get games title by state
     * @returns {string}
     */
    public getGamesTitleByState(): string {
        const childCategory = this.getChildCategoryByState();
        const parentCategory = this.getParentCategoryByState();
        const lang: string = this.translateService.currentLang;

        if (childCategory) {
            return childCategory.title[lang] || childCategory.title['en'];
        } else if (parentCategory) {
            return parentCategory.title[lang] || parentCategory.title['en'];
        }
    }

    /**
     * Get available categories by current state
     *
     * @returns {CategoryModel[]}
     */
    public getCategoriesByState(auth?: boolean): CategoryModel[] {
        if (this.catalogOpened()) {
            const parentCategory = this.getParentCategoryByState();
            const categoryList = this.getCategoriesByParentId(parentCategory.id);
            const newCategory = this.getCategoryBySlug('new');
            const popularCategory = this.getCategoryBySlug('popular');
            if (newCategory) {
                categoryList.push(newCategory);
            }
            if (popularCategory) {
                categoryList.push(popularCategory);
            }
            if (auth || this.configService.get<boolean>('$user.isAuthenticated')) {
                const favouritesCategory = this.getCategoryBySlug('favourites');
                const lastplayedCategory = this.getCategoryBySlug('lastplayed');
                if (favouritesCategory) {
                    categoryList.push(favouritesCategory);
                }
                if (lastplayedCategory) {
                    categoryList.push(lastplayedCategory);
                }
            }
            return this.sortCategories(categoryList);
        }
    }

    /**
     * Get available categories (which has games and menu key)
     *
     * @returns {CategoryModel[]}
     */
    public getCategories(): CategoryModel[] {
        return this.gamesCatalog.getAvailableCategories();
    }

    public getCategoriesForFilter(): CategoryModel[] {
        const isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        return _filter(this.gamesCatalog.getAvailableCategories(), (category: CategoryModel) => {
            if (this.searchBySpecialCats) {
                return !isAuth ? !_includes(this.onlyAuthSpecial, category.slug) : true;
            } else {
                return !category.isSpecial;
            }
        });
    }

    /**
     * Get parent category by state
     *
     * @returns {CategoryModel}
     */
    public getParentCategoryByState(): CategoryModel {
        if (this.catalogOpened()) {
            const categorySlug: string = this.uiRouter.params?.category;
            return this.getCategoryBySlug(categorySlug);
        }
    }

    public getParentWithSpecialCategories(): CategoryModel[] {
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return category.isParent;
        });
    }

    public getParentCategories(): CategoryModel[] {
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return category.isParent
                && !category.isLastPlayed
                && !category.isFavourites
                && !category.isNew
                && !category.isPopular;
        });
    }

    /**
     * Get child category by state
     *
     * @returns {CategoryModel}
     */
    public getChildCategoryByState(): CategoryModel {
        if (this.catalogOpened()) {
            const categorySlug: string = this.uiRouter.params?.childCategory;
            return this.getCategoryBySlug(categorySlug);
        }
    }

    /**
     * Get available category by slug
     *
     * @param {string | string[]} slug
     * @returns {CategoryModel}
     */
    public getCategoryBySlug(slug: string | string[]): CategoryModel {
        return this.gamesCatalog.getCategoryBySlug(slug);
    }

    /**
     * Get available categories by tag
     *
     * @param {string} tag
     * @returns {CategoryModel[]}
     */
    public getCategoriesByTag(tag: string): CategoryModel[] {
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return _includes(category.tags, tag);
        });
    }

    /**
     * Get available categories by id of parent category
     *
     * @param {string} tag
     * @returns {CategoryModel[]}
     */
    public getCategoriesByParentId(id: number): CategoryModel[] {
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return category.parentCategory?.id === id;
        });
    }

    /**
     * Get categories by menu
     *
     * @param {string | string[]} menu
     * @returns {CategoryModel[]}
     */
    public getCategoriesByMenu(menu: string | string[]): CategoryModel[] {
        if (_isString(menu)) {
            menu = [menu];
        }
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return _includes(menu, category.menu);
        });
    }

    public getCategoriesByMerchatName(merchantName: string): CategoryModel[] {
        return _filter(this.gamesCatalog.getCategories(), (category: CategoryModel): boolean => {
            return !!_find(category.merchants, {'name': merchantName});
        });
    }

    /**
     * Get all categories (includes without games)
     *
     * @returns {CategoryModel[]}
     */
    public getAllCategories(): CategoryModel[] {
        return this.gamesCatalog.getCategories();
    }

    public getMerchants(): MerchantModel[] {
        return this.gamesCatalog.getMerchants();
    }

    /**
     * Get merchant by id
     *
     * @param {number} id
     * @returns {MerchantModel}
     */
    public getMerchantById(id: number): MerchantModel {
        return _find(this.gamesCatalog.getMerchants(), (merchant: MerchantModel) => {
            return merchant.id === id;
        });
    }

    /**
     * Gets merchant model by merchant name
     * @param name - `menuId` parameter of merchant
     * @returns MerchantModel
     */
    public getMerchantByName(name: string): MerchantModel {
        return this.gamesCatalog.getMerchantByName(name);
    }

    public getAvailableCategories(): CategoryModel[] {
        return this.gamesCatalog.getAvailableCategories();
    }

    public getAvailableMerchants(): MerchantModel[] {
        return this.gamesCatalog.getAvailableMerchants();
    }

    public getFilteredMerchants(): MerchantModel[] {
        const sportsbookMerchants: number[] = this.configService.get<number[]>('$games.sportsbookMerchants');
        return _filter(this.gamesCatalog.getAvailableMerchants(),
            (merchant: MerchantModel) => !sportsbookMerchants.includes(merchant.id));
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
        return this.gamesCatalog?.getGameList(filter);
    }

    /**
     * Filter games by search string and can use this string to find providers
     * @param query string
     * @param showMerchantsFirst boolean
     * @returns Game[]
     */
    public searchByQuery(query: string, showMerchantsFirst: boolean = false): Game[] {
        return this.gamesCatalog.searchByQuery(query, showMerchantsFirst);
    }

    public getTournamentGames(data: ITournamentGames): Game[] {
        let games = this.getGameList({
            ids: _size(data.Games) ? data.Games : null,
            categories: _map(data.Categories, (id) => {
                return GamesHelper.getCategoryById(id)?.menuId;
            }),
            excludeCategories: _map(data.CategoriesBL, (id) => {
                return GamesHelper.getCategoryById(id)?.menuId;
            }),
            merchants: data.Merchants,
            excludeMerchants: data.MerchantsBL,
            includeSportsbooks: true,
        });

        if (data.GamesBL.length) {
            games = _filter(games, ({ID}) => {
                return !_includes(data.GamesBL, ID);
            });
        }

        if (this.useSeparateSorts) {
            GamesHelper.sortGamesGeneral(games, this.sorts, {
                sortSetting: this.gamesCatalog.gamesSeparateSortSetting,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        } else {
            GamesHelper.sortGames(games, {
                sortSetting: this.gamesCatalog.gamesSortSetting,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        }

        return games;
    }

    /**
     * Get games by freerounds settings
     *
     * @param {FreeraundGamesType} freerounds Freeraund games settings
     * @returns {Game[]} Games list
     */
    public getGamesByFreeRounds(freeRounds: TFreeRoundGames): Game[] {
        if (!freeRounds) {
            return;
        }

        let merchants: number[] = [],
            gameIds: number[] = [];

        _forEach(freeRounds, (data: TGamesWithFreeRounds, merchantAlias: string): void => {
            if (data === 'All') {
                const merchantId: number = this.gamesCatalog.getMerchantByAlias(merchantAlias)?.id;
                if (merchantId) {
                    merchants.push(merchantId);
                }
            } else if (_isArray(data)) {
                gameIds = _union(gameIds, data);
            }
        });

        let gamesList: Game[] = [];

        if (merchants.length) {
            const games: Game[] = this.getGameList({
                merchants: merchants,
                withFreeRounds: true,
                includeSportsbooks: true,
            });

            if (games.length) {
                gamesList = games;
            }
        }

        if (gameIds.length) {
            const games: Game[] = this.getGameList({
                ids: gameIds,
                withFreeRounds: true,
                includeSportsbooks: true,
            });
            if (games.length) {
                gamesList = _union(gamesList, games);
            }
        }

        GamesHelper.sortGames(gamesList, {
            sortSetting: this.gamesCatalog.gamesSortSetting,
            country: this.configService.get('appConfig.country'),
            language: this.translateService.currentLang || 'en',
        });

        return gamesList;
    }

    /**
     * Get game
     *
     * @param {number} merchantId
     * @param {string} launchCode
     * @param {boolean} isSportsbook
     * @param {boolean} byAllGames Global find by all games (by available + not available for user)
     * @returns {Game}
     */
    public getGame(
        merchantId: number,
        launchCode: string,
        isSportsbook: boolean = false,
        byAllGames: boolean = false,
    ): Game {
        return this.gamesCatalog.getGame(merchantId, launchCode, isSportsbook, byAllGames);
    }

    public getGameById(id: number): Game {
        return this.gamesCatalog.getGameById(id);
    }

    /**
     * Get games by categories
     *
     * @param {CategoryModel} categories Game categories
     * @returns {Game[]} Filtered games list
     */
    public getGamesByCategories(categories: CategoryModel[]): Game[] {
        return this.gamesCatalog.getGamesByCategories(categories);
    }

    /**
     * Filter available games
     *
     * @param {Game[]} gamesList Some game list
     * @returns {Game[]} List with only available games
     */
    public filterAvailableGames(gamesList: Game[]): Game[] {
        return _intersectionBy(gamesList, this.getGameList(), 'ID');
    }

    public async getGamesByCategorySlug(slug: string): Promise<Game[]> {
        if (slug == 'last-played') {
            return await this.getLastGames();
        } else if (slug == 'favourites') {
            return await this.getFavouriteGames();
        } else {
            const category = this.getCategoryBySlug(slug);
            if (!category) {
                return;
            }
            return this.getGamesByCategories([category]);
        }
    }

    /**
     * Check opened catalog or not
     *
     * @returns {boolean}
     */
    public catalogOpened(): boolean {
        return _startsWith(this.uiRouter.current.name, 'app.catalog');
    }

    /**
     * Open game
     *
     * @param {Game} game
     * @param {IStartGameOptions} options
     * @deprecated use the launchGame method
     */
    public startGame(game: Game, options: IStartGameOptions): void {
        game.launch(options);
    }

    /**
     * Open game
     *
     * @param {Game} game
     * @param {ILaunchGameParams} params
     */
    public launchGame(game: Game, params?: ILaunchGameParams): void {

        if (game) {
            this.actionService
                .deviceType()
                .pipe(first())
                .subscribe(val => this.deviceType = val);

            const disableDemo = this.configService.get<boolean>('$games.mobile.loginUser.disableDemo');
            const auth = this.configService.get<boolean>('$user.isAuthenticated');
            const gameMode = (disableDemo || !game.hasDemo) ? false : params?.demo;

            if (!auth && !gameMode) {
                this.showRunGameModal(game, !game.hasDemo);
                return;
            }

            if (
                params?.modal?.show &&
                (
                    !params.modal.deviceType ||
                    _isArray(params.modal.deviceType) &&
                    params.modal.deviceType.includes(this.deviceType)
                )
            ) {
                this.showRunGameModal(game, (disableDemo || !game.hasDemo) ? true : params.modal.disableDemo);
                return;
            }

            this.modalService.closeAllModals();
            game.launch({
                demo: gameMode,
            });

        } else {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Failed to open game'),
                    message: gettext('Sorry, something went wrong!'),
                },
            });
        }
    }

    public showRunGameModal(game: Game, disableDemo: boolean): void {

        this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
            common: {
                game: game,
                disableDemo: disableDemo,
            },
        });
    }

    /**
     * Getting id of games that have video
     *
     * @returns {Promise<number[]>}
     */
    public async getIdVerticalVideos(): Promise<number[]> {
        await this.getVerticalThumbsConfig();
        return this.verticalThumbsConfig.haveVideo;
    }

    /**
     * Get fundist category settings
     *
     * @returns {IIndexing<ICategorySettings>}
     */
    public getFundistCategorySettings(): IIndexing<ICategorySettings> {
        return this.gamesCatalog.getCategorySettings();
    }

    protected async getVerticalThumbsConfig(): Promise<IVerticalThumbsConfig> {

        if (!this.verticalThumbsConfig) {

            this.dataService.registerMethod({
                name: 'verticalThumbsConfig',
                system: 'games',
                cache: 480 * 60 * 1000,
                fullUrl: this.configService.get<string>('$games.verticalThumbsConfigUrl'),
                type: 'GET',
                noUseLang: true,
            });

            await this.dataService.request('games/verticalThumbsConfig').then(({data}) => {
                this.verticalThumbsConfig = data || {
                    haveVideo: [],
                };
            }).catch((error) => {
                this.logService.sendLog({
                    code: '3.0.30',
                    data: error,
                    from: {
                        service: 'GamesCatalogService',
                        method: 'getVerticalThumbsConfig',
                    },
                });
            });
        }

        return this.verticalThumbsConfig;
    }

    protected registerMethods(): void {
        const queryGamesParams = this.configService.get<boolean>('$games.slimGamesRequest') ? {slim: true} : {};

        this.dataService.registerMethod({
            name: 'games',
            url: '/games',
            cache: 10 * 60 * 1000,
            type: 'GET',
            params: queryGamesParams,
            preload: 'games',
            system: 'games',
            retries: {
                count: [1000, 3000],
                fallbackUrl: '/static/dist/api/v1/games.json',
            },
            events: {
                success: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
                fail: gamesEvents.FETCH_GAME_CATALOG_FAILED,
            },
        });

        this.dataService.registerMethod({
            name: 'lastGames',
            url: '/games',
            type: 'GET',
            params: {lastGames: '1'},
            system: 'games',
            events: {
                success: gamesEvents.FETCH_LAST_GAME_CATALOG_SUCCEEDED,
                fail: gamesEvents.FETCH_LAST_GAME_CATALOG_FAILED,
            },
        });

        this.dataService.registerMethod({
            name: 'gameLaunchParams',
            url: '/games',
            type: 'GET',
            system: 'games',
        });

        this.dataService.registerMethod({
            name: 'jackpots',
            system: 'games',
            url: '/jackpots',
            type: 'GET',
            period: 10000,
            params: {
                currency: 'EUR',
            },
            retries: {
                count: [1000, 3000],
                fallbackUrl: '/static/dist/api/v1/jackpots.json',
            },
            events: {
                success: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
                fail: gamesEvents.FETCH_JACKPOTS_FAILED,
            },
        });

        this.dataService.registerMethod({
            name: 'favorites',
            system: 'games',
            url: '/favorites',
            type: 'GET',
            events: {
                success: gamesEvents.FETCH_FAVOURITES_SUCCEEDED,
                fail: gamesEvents.FETCH_FAVOURITES_FAILED,
            },
        });
    }

    protected catalogCriteria({name}: StateObject): boolean {
        return 'app.catalog.child' === name && !this.gamesCatalog.defaultCategoryArchitecture;
    }

    /**
     * Load lastPlayed or favorites games
     *
     * @returns {Promise<void>}
     */
    private async loadSpecialCategoryGames<T>(
        requestUrl: 'favorites' | 'lastGames',
        getterProperty: (item: T) => string,
    ): Promise<Game[]> {
        if (this.configService.get('$user.isAuthenticated')) {
            try {
                const data: IData = await this.dataService.request(`games/${requestUrl}`);
                const gameIds: number[] = _map(data.data, (gameInfo: T) => {
                    return _toNumber(getterProperty(gameInfo));
                });
                const games: Game[] = (gameIds.length) ? this.getGameList({ids: gameIds}) : [];
                const category: CategoryModel = this.getCategoryBySlug(SpecialCategoriesGamesSlug[requestUrl]);
                category?.setGames(games);
                return games;
            } catch (error) {
                // TODO Change error code
                this.logService.sendLog({
                    code: (requestUrl === 'favorites') ? '3.0.13' : '3.0.16',
                    data: error,
                    from: {
                        service: 'GamesCatalogService',
                        method: 'loadSpecialCategoryGames',
                    },
                });
            }
        }
    }

    private sortsToDict(allSorts: IAllSortsItemResponse[]): IIndexing<IAllSortsItemResponse> {
        return _reduce(allSorts, (res, sort) => {
            res[sort.ID] = sort;
            return res;
        }, {});
    }

    private async loadGameSorts<
        TSortType extends keyof TGamesSortResponses,
        TResponse extends TGamesSortResponses[TSortType]
    >(
        gameSort: TSortType,
        ...sortType: TSortType extends keyof TAutoGamesSortResponse ? [SortTypeEnum] : []
    ): Promise<IData<TResponse>> {

        const type: SortTypeEnum = _first(sortType);

        const path = type ? `${gameSort}/${type}` : gameSort;

        try {
            const response: IData<TResponse> = await this.dataService.request({
                name: `sorts/${path}`,
                url: `/games/sorts/${path}`,
                system: 'games',
                cache: 10 * 60 * 1000,
                type: 'GET',
                retries: {
                    count: [1000, 3000],
                },
                events: {
                    success: gamesEvents.FETCH_GAME_SORTING_SUCCEEDED,
                    fail: gamesEvents.FETCH_GAME_SORTING_FAILED,
                },
            });
            return response;
        } catch (error) {
            this.logService.sendLog({
                code: '22.0.0',
                data: error,
                from: {
                    service: 'GamesCatalogService',
                    method: 'loadGameSorts',
                },
            });
        }
    }

    /**
     * Load jackpot games
     *
     * @returns {Promise<void>}
     */
    private async loadJackpots(): Promise<void> {
        this.dataService.request('games/jackpots');
    }
}

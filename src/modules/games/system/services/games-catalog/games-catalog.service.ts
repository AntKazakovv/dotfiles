import {Injectable, Injector} from '@angular/core';
import {
    StateService,
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

import _capitalize from 'lodash-es/capitalize';
import _startsWith from 'lodash-es/startsWith';
import _isString from 'lodash-es/isString';
import _isEqual from 'lodash-es/isEqual';
import _map from 'lodash-es/map';
import _includes from 'lodash-es/includes';
import _isArray from 'lodash-es/isArray';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _toNumber from 'lodash-es/toNumber';
import _union from 'lodash-es/union';
import _forEach from 'lodash-es/forEach';
import _intersectionBy from 'lodash-es/intersectionBy';
import _uniqBy from 'lodash-es/uniqBy';
import _reduce from 'lodash-es/reduce';
import _first from 'lodash-es/first';
import _intersection from 'lodash-es/intersection';
import _some from 'lodash-es/some';
import _orderBy from 'lodash-es/orderBy';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers';
import {ICategorySettings} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    EventService,
    IEvent,
} from 'wlc-engine/modules/core/system/services/event/event.service';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
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
import {Catalog} from 'wlc-engine/modules/games/system/classes/catalog';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {catalogArch1} from 'wlc-engine/modules/games/system/config/catalog/v1';
import {catalogArch2} from 'wlc-engine/modules/games/system/config/catalog/v2';
import {SpecialCategoriesGamesSlug} from 'wlc-engine/modules/games/system/config/games.config';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';
import {
    IPlayGameForRealCParams,
} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {
    IRecommendedGamesCParams,
} from 'wlc-engine/modules/games/components/recommended-games/recommended-games.params';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';
import {PragmaticLiveModel} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';
import {
    IFavourite,
    IGameParams,
    ILastPlayedGame,
    ILaunchInfo,
    IStartGameOptions,
    IRecommendedGame,
    gamesEvents,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {Type as IGameThumbType} from 'wlc-engine/modules/games/components/game-thumb/game-thumb.params';
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
import {UserService} from 'wlc-engine/modules/user';
import {CatalogBuilder} from 'wlc-engine/modules/games/system/builders/catalog.builder';
import {MenuService} from 'wlc-engine/modules/menu';
import {ICategoriesSettings} from 'wlc-engine/modules/games/system/builders/categories.builder';
import {IBonusWagerGamesFilter} from 'wlc-engine/modules/bonuses/system/interfaces';
import {IInteractiveText} from 'wlc-engine/modules/core';
import {Games} from 'wlc-engine/modules/games/system/classes/games';
import {GameLauncherService} from 'wlc-engine/modules/games/system/services/game-launcher/game-launcher.service';

export interface ILaunchGameModal {
    show: boolean;
    deviceType?: DeviceType[];
    disableDemo?: boolean;
    showPplInfo?: boolean;
    gameThumbThemeMod?: string;
}

export interface ILaunchGameParams {
    demo?: boolean;
    modal?: ILaunchGameModal;
}

export interface IVideoThumbsConfig {
    haveVideo: number[];
}

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    public readonly ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });
    public readonly gameThumbReady: Promise<void> = new Promise((resolve: () => void): void => {
        this.$gameThumbResolve = resolve;
    });
    public favourites: Game[] = [];
    public favoritesUpdated: Subject<void> = new Subject<void>();
    public idDefVideos: number[] = [];
    public idVerticalVideos: number[] = [];
    public static userService: UserService;

    private searchBySpecialCats: boolean = true;
    private gamesCatalog: Catalog;
    private onlyAuthSpecial: string[] = ['lastplayed', 'favourites', 'last-played', 'recommendations'];
    private deviceType: DeviceType;
    private verticalThumbsConfig: IVideoThumbsConfig;
    private defaultThumbsConfig: IVideoThumbsConfig;
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
        protected hooksService: HooksService,
        protected stateService: StateService,
        protected dataService: DataService,
        protected uiRouter: UIRouterGlobals,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected logService: LogService,
        protected injector: Injector,
        protected injectionService: InjectionService,
        protected gameLauncherService: GameLauncherService,
    ) {
        this.init();
    }

    private $resolve: () => void;
    private $gameThumbResolve: () => void;
    private isMobile: boolean = false;

    public async init(): Promise<void> {
        await this.configService.ready;
        this.registerMethods();

        if (this.configService.get<boolean>('$games.useVideoThumbs.use')) {
            this.getIdDefVideos();
            this.getIdVerticalVideos();
        }

        this.useRealJackpots = this.configService.get<boolean>('$base.games.jackpots.useRealJackpots');
        this.useSeparateSorts = this.configService.get<boolean>('$games.sortsV2.use');
        GamesCatalogService.userService = await this.injectionService.getService<UserService>('user.user-service');

        const fetches: {
            games: Observable<IEvent<IData<IGames>>>,
            sorts?: Observable<IEvent<IData<IAllSortsItemResponse[]>>>
        } = {
            games: this.eventService.filter<IData<IGames>>({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }).pipe(take(1)),
        };

        this.loadGames();

        if (this.useSeparateSorts) {
            fetches.sorts = this.eventService.filter<IData<IAllSortsItemResponse[]>>({
                name: gamesEvents.FETCH_GAME_SORTING_SUCCEEDED,
            }).pipe(take(1));

            this.loadGameSorts(GamesSortEnum.All);
        }

        forkJoin(fetches).subscribe(async ({games, sorts}) => {
            if (sorts) {
                this.sorts = this.sortsToDict(sorts.data.data);
            }

            const menuService: MenuService = await this.injectionService.getService<MenuService>('menu.menu-service');
            const existMenuSettings = await menuService.existFundistMenuSettings();
            const categorySettings = this.configService.get('appConfig.categories')
                || this.configService.get('$games.fundist.defaultCategorySettings.use');

            let catalogBuilder = this.configService.get<CatalogBuilder>('$games.catalogBuilder');
            if (!catalogBuilder) {
                if (categorySettings && existMenuSettings) {
                    catalogBuilder = catalogArch2;
                } else {
                    catalogBuilder = catalogArch1;
                }
            }

            this.gamesCatalog = catalogBuilder.build(
                games.data.data,
                this,
                this.translateService,
                this.configService,
                this.router,
                this.eventService,
                this.injectionService,
                this.hooksService,
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
                this.$gameThumbResolve();
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

    public get architectureVersion(): ICategoriesSettings['architectureVersion'] {
        return this.gamesCatalog.architectureVersion;
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
            this.gameLauncherService.init();
        } catch (error) {
            this.logService.sendLog({
                code: '3.0.0',
                from: {
                    service: 'GamesCatalogService',
                    method: 'loadGames',
                },
            });
            this.$gameThumbResolve();
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
     * Get recommended games
     *
     * @returns {Promise<Game[]>} Recommended Games list
     */
    public async getRecommendedGames(merchantId?: number, launchCode?: string): Promise<Game[]> {
        const gameID: number = merchantId && launchCode
            ? this.getGame(merchantId, launchCode, false, true)?.ID
            : null;

        const game: Game[] = await this.loadSpecialCategoryGames<IRecommendedGame>(
            'recommendations',
            (item: IRecommendedGame) => item.gameId,
            gameID ? {
                gameId: gameID,
                providerId: merchantId,
            } : null,
        );
        return (game) ? game : await this.loadSpecialCategoryGames<IRecommendedGame>(
            'recommendations',
            (item: IRecommendedGame) => item.gameId,
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
    public async getLaunchParams(
        options: IGameParams,
        currency: string,
    ): Promise<ILaunchInfo> {
        let wallet: number;

        if (Games.isMultiWallet) {
            wallet = GamesCatalogService.userService.userProfile.extProfile.currentWallet.walletId;
        }

        return (await this.dataService.request('games/gameLaunchParams', {
            ...options,
            demo: options.demo ? 1 : 0,
            currency,
            wallet,
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
        } else if (parentCategory?.slug == 'lastplayed' || childCategory?.slug == 'lastplayed') {
            games = await this.getLastGames();
        } else if (parentCategory?.slug == 'favourites' || childCategory?.slug == 'favourites') {
            games = await this.getFavouriteGames();
        } else if (parentCategory?.slug == 'recommendations' || childCategory?.slug == 'recommendations') {
            games = await this.getRecommendedGames();
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
            const newCategory = this.getCategoryBySlug('new', parentCategory.slug);
            const popularCategory = this.getCategoryBySlug('popular', parentCategory.slug);
            if (newCategory) {
                categoryList.push(newCategory);
            }
            if (popularCategory) {
                categoryList.push(popularCategory);
            }
            if (auth || this.configService.get<boolean>('$user.isAuthenticated')) {
                const favouritesCategory = this.getCategoryBySlug('favourites', parentCategory.slug);
                const lastplayedCategory = this.getCategoryBySlug('lastplayed', parentCategory.slug);
                const recommendedCategory = this.getCategoryBySlug('recommendations', parentCategory.slug);
                if (recommendedCategory) {
                    categoryList.push(recommendedCategory);
                }
                if (favouritesCategory) {
                    categoryList.push(favouritesCategory);
                }
                if (lastplayedCategory) {
                    categoryList.push(lastplayedCategory);
                }
            }
            return this.sortCategories(_uniqBy(categoryList, 'slug'));
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
                && !category.isRecommended
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
            // TODO refactor after #479773
            if (this.gamesCatalog.architectureVersion === 3) {
                return _find(this.gamesCatalog.getCategoriesBySlugs([categorySlug]), (category: CategoryModel) => {
                    return category.parentCategory?.slug === this.uiRouter.params?.category;
                });
            } else {
                return this.getCategoryBySlug(categorySlug);
            }
        }
    }

    /**
     * Get available category by slug
     *
     * @param {string | string[]} slug
     * @returns {CategoryModel}
     */
    public getCategoryBySlug(slug: string | string[], parentCategorySlug?: string): CategoryModel {
        // TODO refactor after #479773
        if (parentCategorySlug && this.gamesCatalog.architectureVersion === 3) {
            return _find(
                this.gamesCatalog.getCategoriesBySlugs(_isArray(slug) ? slug : [slug]),
                (category: CategoryModel) => {
                    return parentCategorySlug
                        ? category.parentCategory?.slug === parentCategorySlug
                        : category.slug === slug;
                },
            );
        } else {
            return this.gamesCatalog.getCategoryBySlug(slug);
        }
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
        return _filter(this.gamesCatalog.getAvailableCategories(), (category: CategoryModel): boolean => {
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

    public getMerchantByAlias(name: string): MerchantModel {
        return this.gamesCatalog.getMerchantByAlias(name);
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
        const games = this.getGameList();
        const filteredList: Game[] = [];

        if (!data.Merchants.length && !data.MerchantsBL.length
            && !data.Categories.length && !data.CategoriesBL.length
            && !data.Games.length && !data.GamesBL.length
        ) {

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

        _forEach(games, (game: Game) => {

            //check game in black-list
            if ((data.MerchantsBL.length && _includes(data.MerchantsBL, game.merchantID))
                || (data.CategoriesBL.length && _intersection(data.CategoriesBL, game.categoryID).length)
                || (data.GamesBL.length && _includes(data.GamesBL, game.ID))
            ) {
                return;
            }

            if (!data.Merchants.length && !data.Categories.length && !data.Games.length) {
                filteredList.push(game);
                return;
            }

            //check game in white-list
            if ((data.Merchants.length && _includes(data.Merchants, game.merchantID))
                || (data.Categories.length && _intersection(data.Categories, game.categoryID).length)
                || (data.Games.length && _some(data.Games, (gameId: number[] | string[]) => Number(gameId) === game.ID))
            ) {
                filteredList.push(game);
            }
        });

        if (this.useSeparateSorts) {
            GamesHelper.sortGamesGeneral(filteredList, this.sorts, {
                sortSetting: this.gamesCatalog.gamesSeparateSortSetting,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        } else {
            GamesHelper.sortGames(filteredList, {
                sortSetting: this.gamesCatalog.gamesSortSetting,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        }
        return filteredList;
    }

    public getBonusGames(filter: IBonusWagerGamesFilter): Game[] {
        let games: Game[] = [];

        if (!filter.hasRestrictedGames && filter.idGames.length) {
            games = this.getGameList({ids: filter.idGames}); // allowed games
        } else {
            games = this.getGameList({
                merchants: filter.idMerchants,
            });

            if (filter.idCategories.length) {

                if (filter.hasRestrictedCategories) {
                    games = this.gamesCatalog.filterGamesByCategoriesIds(games, filter.idCategories);
                } else {
                    games = this.gamesCatalog.filterGamesByCategoriesIds(games, filter.idCategories, 'include');
                }
            }

            if (filter.hasRestrictedGames && filter.idGames.length) {
                games = _filter(games, (game: Game) => {
                    return !_includes(filter.idGames, game.ID);
                });
            }

        }
        return games;
    }

    /** Filters and returns games which user will receive free rounds */
    public getBonusFreeRoundGames(gameIds: number[]): Game[] {
        return this.getGameList({ids: gameIds});
    }

    /**
     * Checks interactive game
     * @param item IInteractiveText
     * @returns boolean
     */
    public checkInteractiveGame(item: IInteractiveText): boolean {
        const categories = this.getAvailableCategories();

        if (item.actionParams && item.actionParams.url.path === 'app.catalog') {
            if (this.architectureVersion === 3) {
                const categoriesBySlug = categories
                    .filter((category) => category.slug === item.actionParams.url.params.category);
                if (categoriesBySlug?.length) {
                    item.actionParams.url.path = 'app.catalog.child';
                    item.actionParams.url.params.childCategory = item.actionParams.url.params.category;
                    if (categoriesBySlug.some((category) => category.parentCategory?.slug === 'casino')) {
                        item.actionParams.url.params.category = 'casino';
                    } else {
                        item.actionParams.url.params.category = categoriesBySlug[0].parentCategory.slug;
                    }
                } else {
                    return false;
                }
            } else {
                return categories.some((category) => category.slug === item.actionParams.url.params.category);
            }
        }

        if (item.actionParams && item.actionParams.url.path === 'app.catalog.child') {
            return categories.some((category) => category.slug === item.actionParams.url.params.childCategory);
        }
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

    public getGameByState(): Game {
        if (this.uiRouter.params?.merchantId && this.uiRouter.params?.launchCode) {
            return this.getGame(_toNumber(this.uiRouter.params.merchantId), this.uiRouter.params.launchCode);
        }
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

    public getGameById(id: number, tableId?: number): Game {
        return this.gamesCatalog.getGameById(id, tableId);
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
        return _intersectionBy(gamesList, (game: Game): string => {
            return game.ID + game.launchCode;
        });
    }

    public async getGamesByCategorySlug(slug: string): Promise<Game[]> {
        if (slug == 'last-played') {
            return await this.getLastGames();
        } else if (slug == 'favourites') {
            return await this.getFavouriteGames();
        } else if (slug == 'recommendations') {
            return await this.getRecommendedGames();
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
        if (GlobalHelper.isMobileApp()) {
            this.stateService.go('app.run-game', {
                merchantId: game.merchantID,
                launchCode: game.launchCode,
            });
            return;
        }

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
                this.showRunGameModal(
                    game,
                    (disableDemo || !game.hasDemo) ? true : params.modal.disableDemo,
                    params.modal.showPplInfo,
                );
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

    public showRunGameModal(game: Game, disableDemo?: boolean, showPplInfo?: boolean): void {

        this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
            common: {
                game: game,
                disableDemo: !!disableDemo,
                showPplInfo: showPplInfo,
                isLatestBetsWidget: false,
            },
        });
    }

    public showRecommendedGamesModal(merchantID?: number, launchCode?: string): void {
        this.getRecommendedGames(merchantID, launchCode).then((games) => {
            this.modalService.showModal<IRecommendedGamesCParams>('recommendedModal', {
                gamesGridParams: {
                    gamesList: games.slice(0, 4),
                },
            });
        });
    }

    /**
     * Get fundist category settings
     *
     * @returns {IIndexing<ICategorySettings>}
     */
    public getFundistCategorySettings(): IIndexing<ICategorySettings> {
        return this.gamesCatalog.getCategorySettings();
    }

    public hasVideo(gameId: number, type: IGameThumbType): boolean {
        if (type === 'vertical') {
            return this.idVerticalVideos.includes(gameId);
        }
        return this.idDefVideos.includes(gameId);
    }

    /**
     * Getting id of games that have video
     *
     * @returns {Promise<void>}
     */
    protected async getIdVerticalVideos(): Promise<void> {
        await this.getThumbConfig('vertical');
        this.idVerticalVideos = this.verticalThumbsConfig.haveVideo;
    }

    protected async getIdDefVideos(): Promise<void> {
        await this.getThumbConfig('default');
        this.idDefVideos = this.defaultThumbsConfig.haveVideo;
    }

    protected async getThumbConfig(type: 'default' | 'vertical'): Promise<IVideoThumbsConfig> {
        const thumbType = `${type}ThumbsConfig`;

        if (!this[thumbType]) {

            await this.dataService.request(`games/${thumbType}`).then(({data}) => {
                this[thumbType] = data || {
                    haveVideo: [],
                };
            }).catch((error) => {
                this.logService.sendLog({
                    code: '3.0.30',
                    data: error,
                    from: {
                        service: 'GamesCatalogService',
                        method: `get${_capitalize(thumbType)}Url`,
                    },
                });
            });
        }

        return this[thumbType];
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
            params: {
                lastGames: '1',
                limit: this.configService.get<number>('$games.limitLastGames') || 10,
            },
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
                currency: this.configService.get<string>('$base.games.jackpots.requestCurrency') || 'EUR',
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

        this.dataService.registerMethod({
            name: 'recommendations',
            system: 'games',
            url: '/recommendations',
            type: 'GET',
            events: {
                success: gamesEvents.FETCH_RECOMMENDED_SUCCEEDED,
                fail: gamesEvents.FETCH_RECOMMENDED_FAILED,
            },
        });

        this.dataService.registerMethod({
            name: 'defaultThumbsConfig',
            system: 'games',
            cache: 480 * 60 * 1000,
            fullUrl: this.configService.get<string>('$games.defaultThumbsConfigUrl'),
            type: 'GET',
            noUseLang: true,
            withoutCredential: true,
        });

        this.dataService.registerMethod({
            name: 'verticalThumbsConfig',
            system: 'games',
            cache: 480 * 60 * 1000,
            fullUrl: this.configService.get<string>('$games.verticalThumbsConfigUrl'),
            type: 'GET',
            noUseLang: true,
            withoutCredential: true,
        });
    }

    protected catalogCriteria({name}: StateObject): boolean {
        // TODO refactor after #479773
        return 'app.catalog.child' === name && !this.gamesCatalog.defaultCategoryArchitecture;
    }

    /**
     * Load lastPlayed or favorites games
     *
     * @returns {Promise<void>}
     */
    private async loadSpecialCategoryGames<T>(
        requestUrl: 'favorites' | 'lastGames' | 'recommendations',
        getterProperty: (item: T) => string,
        requestParams?: IIndexing<number | string>,
    ): Promise<Game[]> {
        if (this.configService.get('$user.isAuthenticated')) {
            try {
                const data: IData = await this.dataService.request(`games/${requestUrl}`, requestParams);
                const gamesDate: T[] = (requestUrl === 'recommendations') ? data.data.values : data.data;
                const gameIds: number[] = _map(gamesDate, (gameInfo: T) => {
                    return _toNumber(getterProperty(gameInfo));
                });
                let games: Game[] = (gameIds.length) ? this.getGameList({ids: gameIds}) : [];
                const category: CategoryModel = this.getCategoryBySlug(SpecialCategoriesGamesSlug[requestUrl]);

                if (requestUrl === 'recommendations') {
                    const gamesScore = _reduce<IRecommendedGame, IIndexing<number>>(
                    gamesDate as IRecommendedGame[],
                    (result, value) => {
                        result[value.gameId] = value.score;
                        return result;
                    }, {});
                    games = _orderBy(games, function (game: Game) {
                        return gamesScore[game.ID];
                    }, 'desc');
                }
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

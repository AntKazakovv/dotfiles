import {Injectable} from '@angular/core';
import {
    UIRouter,
    UIRouterGlobals,
} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';
import {
    Observable,
    Subject,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    map,
} from 'rxjs/operators';

import {
    ActionService,
    ConfigService,
    DataService,
    DeviceType,
    EventService,
    IData,
    IPushMessageParams,
    LayoutService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    Game,
    GamesCatalog,
    IFavourite,
    IGameParams,
    IGamesFilterData,
    ILastPlayedGame,
    ILaunchInfo,
    IPlayGameForRealCParams,
    IStartGameOptions,
    JackpotModel,
    MerchantModel,
    gamesEvents,
} from 'wlc-engine/modules/games';
import {UserService} from 'wlc-engine/modules/user';
import {ITournamentGames} from 'wlc-engine/modules/tournaments';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';

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

export interface ILaunchGameModal {
    show: boolean;
    deviceType?: DeviceType[];
    disableDemo?: boolean;
}

export interface ILaunchGameParams {
    demo?: boolean;
    modal?: ILaunchGameModal;
}

export enum SpecialCategoriesGamesSlug {
    favorites = 'favourites',
    lastGames = 'lastplayed',
}

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
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
    private lastPlayed: Game[] = [];

    constructor(
        public configService: ConfigService,
        public router: UIRouter,
        public eventService: EventService,
        public translateService: TranslateService,
        protected dataService: DataService,
        protected userService: UserService,
        protected uiRouter: UIRouterGlobals,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
    ) {
        this.init();
    }

    private $resolve: () => void;

    private isMobile: boolean = false;

    public async init(): Promise<void> {
        await this.configService.ready;
        this.registerMethods();

        this.loadGames();

        this.eventService.subscribe({
            name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
        }, ({data}: IData) => {
            this.gamesCatalog = new GamesCatalog(
                data.data,
                this,
                this.translateService,
                this.configService,
                this.router,
                this.eventService,
            );
            this.$resolve();
            this.loadJackpots();
            this.getFavouriteGames();
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog.loadJackpots(data.data);
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_FAVOURITES_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog?.loadFavourites(data.data);
            this.favoritesUpdated.next();
        });

        // хз, надо ли заново грузить
        this.eventService.subscribe([
            // TODO перейти на константы
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.loadGames();
        });

        this.actionService.deviceType()
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }
                this.isMobile = type !== DeviceType.Desktop;
            });
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
                distinctUntilChanged((prev, curr) => _isEqual(prev?.data, curr?.data)),
                map(el => _map(el?.data, (data) => new JackpotModel(data))),
            );
    }


    /**
     *
     * @returns {Promise<void>}
     */
    public async loadGames(): Promise<void> {
        const request = 'games/games';
        await this.dataService.request(request);
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
            (item: IFavourite) => item.game_id,
        );
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

    public isSpecialCategory(category: CategoryModel): boolean {
        return this.gamesCatalog.isSpecialCategory(category);
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
        if (parentCategory?.slug == 'lastplayed') {
            games = await this.getLastGames();
        } else if (parentCategory?.slug == 'favourites') {
            games = await this.getFavouriteGames();
        } else {
            if (childCategory) {
                await childCategory.isReady;
                games = childCategory.games;
            } else if (parentCategory) {
                await parentCategory.isReady;
                games = parentCategory.games;
            } else {
                games = this.getGameList();
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
    public getCategoriesByState(): CategoryModel[] {
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
            if (this.configService.get<boolean>('$user.isAuthenticated')) {
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
            return category.isParent && !category.isLastPlayed && !category.isFavourites && !category.isNew && !category.isPopular;
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

    public getTournamentGames(data: ITournamentGames): Game[] {
        const games = this.getGameList({
            ids: _size(data.Games) ? data.Games : null,
            categories: _map(data.Categories, (id) => {
                return GamesHelper.getCategoryById(id)?.menuId;
            }),
            excludeCategories: _map(data.CategoriesBL, (id) => {
                return GamesHelper.getCategoryById(id)?.menuId;
            }),
            merchants: data.Merchants,
            excludeMerchants: data.MerchantsBL,
        });

        return data.GamesBL.length ? _filter(games, ({ID}) => {
            return !_includes(data.GamesBL, ID);
        }) : games;
    }

    // public getGameById(id: string): Game {
    //     return this.gameCatalog.getGameById(id);
    // }

    public getGame(merchantId: number, launchCode: string, isSportsbook: boolean = false): Game {
        return this.gamesCatalog.getGame(merchantId, launchCode, isSportsbook);
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

    protected registerMethods(): void {
        // TODO check config and types
        // const queryGamesParams = this.configService.get<boolean>('appConfig.siteconfig.gamesCatalog.slim') ? {slim: true} : {};
        const queryGamesParams = {slim: 'true'};

        this.dataService.registerMethod({
            name: 'games',
            url: '/games',
            cache: 120 * 60 * 1000,
            type: 'GET',
            params: queryGamesParams,
            preload: 'games',
            system: 'games',
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
            let games: Game[] = [];
            const data: IData = await this.dataService.request(`games/${requestUrl}`);

            const gameIds: number[] = _map(data.data, (gameInfo: T) => {
                return _toNumber(getterProperty(gameInfo));
            });

            if (gameIds.length) {
                games = this.getGameList({ids: gameIds});
            }
            const category: CategoryModel = this.getCategoryBySlug(SpecialCategoriesGamesSlug[requestUrl]);
            category?.setGames(games);
            return games;
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

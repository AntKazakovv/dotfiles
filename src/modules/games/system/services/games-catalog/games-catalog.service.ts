import {Injectable} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {Subject} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    DataService,
    IData,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {GamesCatalog} from 'wlc-engine/modules/games/system/models/games-catalog.model';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';

import {
    ICategory,
    IMerchant,
    IStartGameOptions,
    ILaunchInfo,
    IGameParams,
    IJackpot,
    IGames,
    gamesEvents,
    IFavourite,
    ILastPlayedGame,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import {
    find as _find,
    filter as _filter,
    includes as _includes,
    startsWith as _startsWith,
    isString as _isString,
    toNumber as _toNumber,
    map as _map,
} from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });
    public favourites: number[] = [];

    public favoritesUpdated: Subject<void> = new Subject<void>();

    private gamesCatalog: GamesCatalog;
    private categoryMenus: string[] = [
        'main-menu',
        'category-menu',
    ];
    private $resolve: () => void;

    constructor(
        public configService: ConfigService,
        public router: UIRouter,
        public eventService: EventService,
        protected dataService: DataService,
        protected userService: UserService,
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        this.registerMethods();

        // TODO cache
        // this.gamesCatalogCache = this.CacheFactory.get('gamesCatalogCache');
        // if (!this.gamesCatalogCache) {
        //     this.gamesCatalogCache = this.CacheFactory.createCache('gamesCatalogCache', {
        //         deleteOnExpire: 'aggressive',
        //         // recycleFreq: 60000,
        //         maxAge: 60000,
        //         // recycleFreq: 60000,
        //         storageMode: 'sessionStorage',
        //         storageImpl: safeSessionStorage,
        //     });
        //
        //     if (!this.gamesCatalogCache) {
        //         this.gamesCatalogCache = this.CacheFactory.get('gamesCatalogCache');
        //     }
        // } else {
        //     _each(this.gamesCatalogCache.keys(), (item) => {
        //         const lang = /lang\=([^&]*)/gi.exec(item);
        //         if (lang?.length >= 2 && lang[1] !== this.appConfig.language) {
        //             this.gamesCatalogCache.remove(item);
        //         }
        //     });
        // }

        this.loadGames();

        this.eventService.subscribe({
            name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog = new GamesCatalog(data.data, this);
            this.$resolve();
            this.loadJackpots();
            this.loadFavourites();
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
        }, (data: IData) => {
            this.gamesCatalog.loadJackpots(data.data);
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_FAVOURITES_SUCCEEDED,
        }, (data: IData) => {
            this.favourites = data.data.map((fav: IFavourite) => _toNumber(fav.game_id));
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
     *
     * @returns {Promise<void>}
     */
    private async loadLastGames(): Promise<ILastPlayedGame[]> {
        if (this.configService.get('$user.isAuthenticated')) {
            const data: IData = await this.dataService.request('games/lastGames');
            return data.data;
        }
    }

    /**
     * Get last games
     *
     * @returns {Promise<Game[]>} Last games list
     */
    public async getLastGames(): Promise<Game[]> {
        const lastPlayed: ILastPlayedGame[] = await this.loadLastGames();
        const lastPlayedIds: number[] = _map(lastPlayed, (gameInfo: ILastPlayedGame) => {
            return _toNumber(gameInfo.ID);
        });
        return this.getGameList({
            ids: lastPlayedIds,
        });
    }

    /**
     *
     * @returns {Promise<void>}
     */
    public async loadJackpots(): Promise<void> {
        this.dataService.request('games/jackpots');
    }

    /**
     *
     * @returns {Promise<void>}
     */
    public async loadFavourites(): Promise<IFavourite[]> {
        if (this.configService.get('$user.isAuthenticated')) {
            const data: IData = await this.dataService.request('games/favorites');
            return data.data;
        }
    }

    /**
     * Get favorite games
     *
     * @returns {Promise<Game[]>}
     */
    public async getFavouriteGames(): Promise<Game[]> {
        const favoriteGames: IFavourite[] = await this.loadFavourites();
        this.favourites = _map(favoriteGames, (gameInfo: IFavourite) => {
            return _toNumber(gameInfo.game_id);
        });
        return this.getGameList({
            ids: this.favourites,
        });
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
                this.favourites.push(game.ID);
            } else {
                this.favourites = this.favourites.filter((item) => item !== game.ID);
            }
        }
        this.favoritesUpdated.next();
        return !!response.data.favorite;
    }

    public isSpecialCategory(category: CategoryModel): boolean {
        return this.gamesCatalog.isSpecialCategory(category);
    }

    /**
     * Get game launch params
     *
     * @param {IGameParams} options
     * @returns {Promise<ILaunchInfo>}
     */
    public async getLaunchParams(options: IGameParams): Promise<ILaunchInfo> {
        const data: IData = await this.dataService.request('games/gameLaunchParams', options);
        return data.data;
    }

    /**
     * Get available categories by current state
     *
     * @returns {CategoryModel[]}
     */
    public getCategoriesByState(): CategoryModel[] {
        if (this.catalogOpened()) {
            const parentCategory = this.getParentCategoryByState();
            return this.getCategoriesByParentId(parentCategory.id);
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
        return _filter(this.gamesCatalog.getAvailableCategories(), (category: CategoryModel) => {
            return !category.isSpecial;
        });
    }

    /**
     * Get parent category by state
     *
     * @returns {CategoryModel}
     */
    public getParentCategoryByState(): CategoryModel {
        if (this.catalogOpened()) {
            const categorySlug: string = this.router.stateService.params?.category;
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
            return category.isParent && !category.isLastPlayed && !category.isFavourites;
        });
    }

    /**
     * Get child category by state
     *
     * @returns {CategoryModel}
     */
    public getChildCategoryByState(): CategoryModel {
        if (this.catalogOpened()) {
            const categorySlug: string = this.router.stateService.params?.childCategory;
            return this.getCategoryBySlug(categorySlug);
        }
    }

    /**
     * Get available category by slug
     *
     * @param {string} slug
     * @returns {CategoryModel[]}
     */
    public getCategoryBySlug(slug: string): CategoryModel {
        return _find(this.gamesCatalog.getCategories(), (category: CategoryModel) => {
            return category.slug === slug;
        });
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

    public getAvailableCategories(): CategoryModel[] {
        return this.gamesCatalog.getAvailableCategories();
    }

    public getAvailableMerchants(): MerchantModel[] {
        return this.gamesCatalog.getAvailableMerchants();
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

    // public getGameById(id: string): Game {
    //     return this.gameCatalog.getGameById(id);
    // }

    public getGame(merchantId: number, launchCode: string): Game {
        return this.gamesCatalog.getGame(merchantId, launchCode);
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
     * Check opened catalog or not
     *
     * @returns {boolean}
     */
    public catalogOpened(): boolean {
        return _startsWith(this.router.stateService.current.name, 'app.catalog');
    }

    /**
     * Open game
     *
     * @param {Game} game
     * @param {IStartGameOptions} options
     */
    public startGame(game: Game, options: IStartGameOptions): void {
        game.launch(options);
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
}

import {Injectable} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {Subscription} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {
    DataService,
    IData,
} from 'wlc-engine/modules/core/services/data/data.service';
import {GamesCatalog} from 'wlc-engine/modules/games/models/games-catalog.model';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {EventService} from 'wlc-engine/modules/core/services';
import {UserService} from 'wlc-engine/modules/user/services';

import {
    ICategory,
    IMerchant,
    IStartGameOptions,
    ILaunchInfo,
    IGameParams,
    IJackpot,
    IGames,
    gamesEvents, IFavourite,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {IGamesFilterData} from "wlc-engine/modules/games/interfaces/filters.interfaces";

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    constructor(
        public configService: ConfigService,
        public router: UIRouter,
        public eventService: EventService,
        protected dataService: DataService,
        protected userService: UserService,
    ) {
        this.init();
    }

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    public favourites: number[] = [];
    protected gamesCatalog: GamesCatalog;

    private $resolve: () => void;

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
            this.gamesCatalog?.loadFavourites(data.data);
            this.favourites = data.data.map((fav: IFavourite) => fav.game_id);
        });

        // хз, надо ли заново грузить
        this.eventService.subscribe([
            // TODO перейти на константы
            {name: 'LOGIN',},
            {name: 'LOGOUT',},
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
    public async loadLastGames(): Promise<void> {
        if (this.configService.get('$user.isAuthenticated')) {
            await this.dataService.request('games/lastGames');
        }
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
    public async loadFavourites(): Promise<void> {
        if (this.configService.get('$user.isAuthenticated')) {
            this.dataService.request('games/favorites');
        }
    }

    /**
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
                this.favourites.push(game.ID)
            }
            else {
                this.favourites = this.favourites.filter((item) => item !== game.ID);
            }
        }
        return !!response.data.favorite;
    }

    /**
     * Get game launch params
     *
     * @param {IGameParams} options
     * @returns {Promise<ILaunchInfo>}
     */
    public async getLaunchParams(options: IGameParams): Promise<ILaunchInfo> {
        return await this.dataService.request<ILaunchInfo>('games/gameLaunchParams', options) as ILaunchInfo;
    }

    public getCategories(): ICategory[] {
        return this.gamesCatalog.getCategories();
    }

    public getMerchants(): IMerchant[] {
        return this.gamesCatalog.getMerchants();
    }

    public getAvailableCategories(): ICategory[] {
        return this.gamesCatalog.getAvailableCategories();
    }

    public getAvailableMerchants(): IMerchant[] {
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

    public getGame(merchantId: string, launchCode: string): Game {
        return this.gamesCatalog.getGame(merchantId, launchCode);
    }

    public getGameById(id: number): Game {
        return this.gamesCatalog.getGameById(id);
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

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
import {UserService} from 'wlc-engine/modules/user/services/user.service';

import {
    ICategory,
    IMerchant,
    IStartGameOptions,
    ILaunchInfo,
    IGameParams,
    IJackpot,
    IGames,
    gamesEvents,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {error} from "selenium-webdriver";

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    constructor(
        protected configService: ConfigService,
        protected router: UIRouter,
        protected dataService: DataService,
        protected eventService: EventService,
        protected userService: UserService,
    ) {
        this.init();
    }

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    protected gamesCatalog: GamesCatalog;
    protected gamesHandler: Subscription;
    protected jackpotsHandler: Subscription;

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
        }, (games: IGames) => {
            this.gamesCatalog = new GamesCatalog(games, this.configService, this.eventService, this.router);
            this.loadJackpots();
        });

        this.eventService.subscribe({
            name: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
        }, (jackpots: IJackpot[]) => {
            this.gamesCatalog.loadJackpots(jackpots as IJackpot[]);
        });

        // TODO подписка на login/logout
    }

    /**
     *
     * @returns {Promise<void>}
     */
    public async loadGames(): Promise<void> {
        const request = 'games/games';
        await this.dataService.request(request);

        this.gamesHandler = this.dataService.subscribe(request, (games: IData) => {
            try {
                this.eventService.emit({
                    name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
                    data: games.data,
                });
            } catch (error) {
                this.eventService.emit({
                    name: gamesEvents.FETCH_GAME_CATALOG_FAILED,
                    data: error,
                });
            }
        });
    }

    /**
     *
     * @returns {Promise<void>}
     */
    public async loadLastGames(): Promise<void> {
        const request = 'games/lastGames';
        await this.dataService.request(request);

        const gamesLastHandler: Subscription = this.dataService.subscribe(request, (games: IData) => {
            try {
                this.eventService.emit({
                    name: gamesEvents.FETCH_LAST_GAME_CATALOG_SUCCEEDED,
                    data: games.data,
                });
            } catch (error) {
                this.eventService.emit({
                    name: gamesEvents.FETCH_LAST_GAME_CATALOG_FAILED,
                    data: error,
                });
            }
        });

        gamesLastHandler.unsubscribe();
    }

    /**
     *
     * @returns {Promise<void>}
     */
    public async loadJackpots(): Promise<void> {
        const request = 'games/jackpots';
        this.dataService.request(request);

        this.jackpotsHandler = this.dataService.subscribe(request, (jackpots: IData) => {
            try {
                this.eventService.emit({
                    name: gamesEvents.FETCH_JACKPOTS_SUCCEEDED,
                    data: jackpots.data,
                });
            } catch (error) {
                this.eventService.emit({
                    name: gamesEvents.FETCH_JACKPOTS_FAILED,
                    data: error,
                });
            }
        });
    }


    public async addRemoveFavorites(ID: string): Promise<void> {
        if (!this.userService.isAuthenticated) { return; }

        await this.dataService.request({
            name: 'addFavourite',
            system: 'games',
            url: `/favorites/${ID}`,
            type: 'POST',
        }).then((response: IData) => {
            const game: Game = this.gamesCatalog.getGameById(ID);
            if (game) {
                game.isFavourite = !!response.data.favorite;
            }
        }).catch((error) => {
            // TODO обработка ошибок
        });
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
        return this.gamesCatalog.getGameList(
            includeCategories,
            includeMerchants,
            excludeCategories,
            excludeMerchants,
        );
    }


    // public getGameById(id: string): Game {
    //     return this.gameCatalog.getGameById(id);
    // }

    public getGame(merchantId: string, launchCode: string): Game {
        return this.gamesCatalog.getGame(merchantId, launchCode);
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
        });

        this.dataService.registerMethod({
            name: 'lastGames',
            url: '/games',
            type: 'GET',
            params: {lastGames: '1'},
            system: 'games',
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
        });
    }
}

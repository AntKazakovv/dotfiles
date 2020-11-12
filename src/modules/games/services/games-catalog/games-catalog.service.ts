import {Injectable} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {DataService, IData, IRequestMethod, RequestParamsType, RestMethodType} from 'wlc-engine/modules/core/services/data/data.service';
import {GamesCatalog} from 'wlc-engine/modules/games/models/games-catalog.model';
import {Game} from 'wlc-engine/modules/games/models/game.model';

import {
    ICategory,
    IMerchant,
    IStartGameOptions,
    ILaunchInfo,
    IGameParams,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

@Injectable({
    providedIn: 'root',
})
export class GamesCatalogService {

    constructor(
        protected configService: ConfigService,
        protected router: UIRouter,
        protected dataService: DataService,
    ) {
        this.init();
    }

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

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

        // TODO check config and types
        const queryParams = this.configService.get<boolean>('appConfig.siteconfig.gamesCatalog.slim') ? {slim: true} : {};

        const data = await this.load();
        this.gamesCatalog = new GamesCatalog(data.data, this.configService);
        this.$resolve();

        // TODO подписка на login/logout
    }

    public load(): Promise<IData> {
        return this.dataService.request({
            name: 'games',
            system: 'games',
            url: '/games',
            type: 'GET',
            preload: 'games',
            mapFunc: (res) => this.prepareData(res),
        });
    }

    /**
     * Get game launch params
     *
     * @param {IGameParams} options
     * @returns {Promise<ILaunchInfo>}
     */
    public async getLaunchParams(options: IGameParams): Promise<ILaunchInfo> {
        return (await this.dataService.request('games/gameLaunchParams', options)).data as ILaunchInfo;
    }

    public getCategories(): ICategory[] {
        return this.gamesCatalog.getCategories();
    }

    public getMerchants(): IMerchant[] {
        return this.gamesCatalog.getMerchants();
    }

    public getGameList(): Game[] {
        return this.gamesCatalog.getGameList();
    }

    public getLastGameList(): Promise<any> {
        return this.queryLastGames();
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
        this.router.stateService.go('app.gameplay', {
            merchantId: game.MerchantID,
            launchCode: game.LaunchCode,
            demo: options.demo,
        });
    }

    protected queryLastGames(): Promise<any> {
        return new Promise((resolve, reject) => {
            /*this.$restLastGames.query({lastGames: 1},
                (result: any) => {
                    resolve(result);
                },
                (error: any) => {
                    reject(error);
                });*/
            resolve('');
        });
    }

    protected prepareData(response: any): GamesCatalog {
        return response;
    }

    protected regMethod(
        name: string,
        url: string,
        type: RestMethodType,
        period?: number,
    ): void {
        const params: IRequestMethod = {name, system: 'games', url, type};
        if (period) {
            params.period = period;
        }
        this.dataService.registerMethod(params);
    }

    protected registerMethods(): void {
        this.regMethod('gameLaunchParams', '/games', 'GET');
    }

}

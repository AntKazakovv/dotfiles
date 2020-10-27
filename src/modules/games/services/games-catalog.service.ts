import {Injectable} from '@angular/core';
import {IIndexing} from 'wlc-engine/interfaces/index';
import {ConfigService} from 'wlc-engine/modules/core/services/config/config.service';
import {DataService, IData} from 'wlc-engine/modules/core/services/data/data.service';
import {GameCatalog} from 'wlc-engine/modules/games/models/game-catalog.model';
import {Game} from 'wlc-engine/modules/games/models/game.model';

import {
    ICategory,
    IMerchant,
    IAvailableCategories,
    IAvailableMerchants,
    ISupportedItem,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

@Injectable({
    providedIn: 'root'
})

export class GamesCatalogService {

    constructor(
        protected configService: ConfigService,
        protected data: DataService,
    ) {
        this.init();
    }

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    protected gameCatalog: GameCatalog;

    private $resolve: () => void;

    public async init(): Promise<void> {
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
        const queryParams = this.configService.appConfig.siteconfig?.gamesCatalog?.slim ? {slim: true} : {};

        const data = await this.load();
        this.gameCatalog = new GameCatalog(data.data);
        console.warn(this.gameCatalog);

        // TODO подписка на login/logout
    }

    public load(): Promise<IData> {
        return this.data.request({
            name: 'games',
            system: 'games',
            url: '/games',
            type: 'GET',
            preload: 'games',
            mapFunc: (res) => this.prepareData(res),
        });
    }

    public getCategories(): ICategory[] {
        return this.gameCatalog.getCategories();
    }

    public getMerchants(): IMerchant[] {
        return this.gameCatalog.getMerchants();
    }

    public getGameList(): Game[] {
        console.warn('this.gameCatalog', this.gameCatalog);
        return this.gameCatalog.getGameList();
    }

    public getLastGameList(): Promise<any> {
        return this.queryLastGames();
    }

    // public getGameById(id: string): Game {
    //     return this.gameCatalog.getGameById(id);
    // }

    public getGame(merchantId: string, launchCode: string): Game {
        return this.gameCatalog.getGame(merchantId, launchCode);
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

    protected prepareData(response: any): GameCatalog {
        this.$resolve();
        return response;
    }


}

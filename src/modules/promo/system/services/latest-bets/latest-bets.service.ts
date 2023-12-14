import {Injectable} from '@angular/core';

import {
    BehaviorSubject,
    Observable,
    map,
} from 'rxjs';

import {
    IData,
    InjectionService,
    LogService,
} from 'wlc-engine/modules/core';

import {IWebSocketConfig} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';

import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    WebSocketEvents,
    WebsocketService,
    TWSEndPoint,
} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';

import {GamesCatalogService} from 'wlc-engine/modules/games';
import {
    ILatestBetData,
    LatestBetsModel,
} from 'wlc-engine/modules/promo/system/models/latest-bets.model';
export interface IFakeBets {
    count?: number,
    minBet?: number,
    maxBet?: number,
    currency?: string,
}

const randomNames: string[] = [
    'R****f J***d',
    'O*********d L****d',
    'K*******n U**********e',
    'T********u R****f',
    'P*****i E**********h',
    'L*********d B*****k',
    'O****c U****j',
    'A********i D****h',
    'T********D D******k',
    'A******j P******v',
    'M***m S****v',
];


@Injectable()
export class LatestBetsService {
    protected latestBet$: BehaviorSubject<LatestBetsModel> = new BehaviorSubject(undefined);
    protected latestBetsCache$: BehaviorSubject<LatestBetsModel[]> = new BehaviorSubject(undefined);
    protected latestHighRollers$:  BehaviorSubject<LatestBetsModel[]> = new BehaviorSubject(undefined);
    protected bets: LatestBetsModel[];
    private gamesCatalogService: GamesCatalogService;
    private minBetParams: number;

    constructor(
        private dataService: DataService,
        private websocketService: WebsocketService,
        private injectionService: InjectionService,
        private logService: LogService,
    ){
        this.init();
    }

    public setMinBet(minBet: number): void {
        this.minBetParams = minBet;
    }

    protected async init(): Promise<void> {
        if (!this.gamesCatalogService) {
            this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
            await this.gamesCatalogService.ready;
        }

        this.registerMethods();
        this.fetchWSConnectData();
        this.fetchLastCacheBets();
    }

    private registerMethods(): void {

        this.dataService.registerMethod({
            system: 'reports',
            name: 'LastBets',
            fullUrl: '/api/v1/reports?report=v2/Reports/LastBets',
            type: 'GET',
        });

        this.dataService.registerMethod({
            system: 'user',
            name: 'publicSocketsData',
            url: '/publicSocketsData',
            type: 'GET',
        });
    }

    public async fetchWSConnectData(): Promise<void> {
        try {
            const response: IData = await this.dataService.request('user/publicSocketsData');
            const cnf: IWebSocketConfig= {
                api: response.data.api,
                token: response.data.token,
                server2: response.data.server2,
            };
            this.websocketService.addWsEndPointConfig('wsc2', cnf);
        }
        catch(error) {
            this.logService.sendLog({code: '0.0.12', data: error});
        }
    }

    public async fetchLastCacheBets(): Promise<void> {
        if (!this.gamesCatalogService) {
            this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
            await this.gamesCatalogService.ready;
        }

        try {
            const response: IData = await this.dataService.request('reports/LastBets', {minBet: 0, quantity: 10});
            const data = JSON.parse(response.data);
            this.bets = this.getData<LatestBetsModel[]>(data);
            setTimeout(() => {
                this.latestBetsCache$.next(this.bets);
            });
        }
        catch(error) {
            setTimeout(() => {
                this.latestBetsCache$.next(this.getFakeHighRollers({count:5, minBet:1, maxBet:100}));
            });
            this.logService.sendLog({code: '0.10.0', data: error});
        }

        try {
            const response: IData = await this.dataService
                .request('reports/LastBets', {minBet: this.minBetParams, quantity: 10});
            const data = JSON.parse(response.data);
            this.bets = this.getData<LatestBetsModel[]>(data);
            setTimeout(() => {
                this.latestHighRollers$.next(this.bets);
            });
        }
        catch (error){
            setTimeout(() => {
                this.latestHighRollers$.next(this.getFakeHighRollers({count:5, minBet:100, maxBet:200}));
            });
            this.logService.sendLog({code: '0.10.0', data: error});

        }
    }

    /**
    * Subscribe on stream from websocket
    */
    public getLatestBet(endPoint: TWSEndPoint): Observable<LatestBetsModel> {
        return this.websocketService.getMessages(
            {endPoint, events: [WebSocketEvents.RECEIVE.LATEST_BETS]}).pipe(
            map((message: LatestBetsModel) => message.data && this.getData<LatestBetsModel>(message.data)),
        );
    }

    private getData<T extends LatestBetsModel | LatestBetsModel[]>(data: ILatestBetData | ILatestBetData[]): T {

        let bet: LatestBetsModel;

        if (Array.isArray(data)) {
            return data.filter((item: ILatestBetData) => {
                if (this.gamesCatalogService.getGameById(+item.GameID)) {
                    return item;
                }
            }).map((item: ILatestBetData)=>{ bet = new LatestBetsModel(
                {service:'LatestBetsService', method: 'getData'},
                item,
                this.gamesCatalogService);
            return bet;
            }) as T ;
        } else {
            if (this.gamesCatalogService.getGameById(+data.GameID)) {
                bet = new LatestBetsModel(
                    {service:'LatestBetsService', method: 'getData'},
                    data,
                    this.gamesCatalogService);
                return bet as T;
            }
        }
    }

    public getLatestBetsCache(): Observable<LatestBetsModel[]> {
        return this.latestBetsCache$.asObservable();
    }

    public getLatestHighRollers(): Observable<LatestBetsModel[]> {
        return this.latestHighRollers$.asObservable();
    }

    public getFakeHighRollers(params: IFakeBets): LatestBetsModel[] {
        const tmpBets = [];
        const newGamesIds =
        this.gamesCatalogService.getGamesByCategories([this.gamesCatalogService.getCategoryBySlug('new')])
            .map((item)=>item.ID);

        for (let i = 0; i < params.count; i++) {
            const betAmount = Math.floor(Math.random()*(params.maxBet-params.minBet)+params.minBet);
            const multiplier = +(Math.random()*(9)+1).toFixed(2);
            const amount = Math.floor(betAmount * multiplier);
            tmpBets.push({
                MaskedUserName: this.getRandomArrElem(randomNames),
                Amount: amount,
                Multiplier: multiplier,
                BetAmount: betAmount,
                BetAmountEUR: betAmount,
                GameID: this.getRandomArrElem(newGamesIds),
                Currency: 'EUR',
                Type: 'win',
            },
            );
        }
        return this.getData<LatestBetsModel[]>(tmpBets);
    }

    protected getRandomArrElem<T = string>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}

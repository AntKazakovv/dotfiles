import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Observable,
} from 'rxjs';
import {
    map,
    first,
    pairwise,
    takeWhile,
} from 'rxjs/operators';
import {filter} from 'rxjs/internal/operators/filter';

import {
    ConfigService,
    DataService,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {
    IData,
    RequestParamsType,
} from 'wlc-engine/modules/core/system/services/data/data.service';
import {WinnerModel} from 'wlc-engine/modules/promo/system/models/winner.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';

import {
    merge as _merge,
    differenceWith as _differenceWith,
    isEqual as _isEqual,
    map as _map,
} from 'lodash-es';

/**
 * Params for request
 * @param period - time interval for request in milliseconds. `30000` by default
 * @param params - http request params `RequestParamsType`
 */
export interface IWinnersParams {
    period?: number;
    params?: RequestParamsType;
};

export enum WinnersServiceEvents {
    LATEST_WINS_GET = 'LATEST_WINNERS_GET',
    LATEST_WINS_SUCCESS = 'LATEST_WINNERS_SUCCESS',
    LATEST_WINS_ERROR = 'LATEST_WINNERS_ERROR',
    BIGGEST_WINS_GET = 'BIGGEST_WINS_GET',
    BIGGEST_WINS_SUCCESS = 'BIGGEST_WINS_SUCCESS',
    BIGGEST_WINS_ERROR = 'BIGGEST_WINS_ERROR',
};

export interface IWinnerData {
    Amount: number;
    AmountEUR: number;
    Currency: string;
    CountryIso2: string;
    CountryIso3: string;
    Date: string;
    GameID: number;
    ID: string;
    Name: string;
};


const defaultParams: {[key: string]: IWinnersParams} = {
    latestWins: {
        period: 30000,
        params: {
            limit: '20',
            min: '1',
            slim: '1', //! required
        },
    },
    biggestWins: {
        period: 30000,
        params: {
            limit: '20',
            min: '1',
            slim: '1', //! required
        },
    },
};

@Injectable({
    providedIn: 'root',
})
export class WinnersService {

    protected latestWins$: BehaviorSubject<WinnerModel[]> = new BehaviorSubject(undefined);
    protected biggestWins$: BehaviorSubject<WinnerModel[]> = new BehaviorSubject(undefined);

    protected latestStream$: Observable<WinnerModel[]>;
    protected biggestStream$: Observable<WinnerModel[]>;

    constructor(
        private dataService: DataService,
        private configService: ConfigService,
        private eventService: EventService,
        private gameCatalogService: GamesCatalogService,
    ) {
        this.init();
    }

    /**
     * Accessor for getting last response
     * @returns last success response of latest winners
     */
    public get latestWins(): WinnerModel[] {
        return this.latestWins$.getValue();
    }

    /**
     * Accessor for getting last response
     * @returns last success response if biggest winners
     */
    public get biggestWins(): WinnerModel[] {
        return this.biggestWins$.getValue();
    }

    /**
     * Accessor for observable subject `latestWins$`
     * @returns {Observable<WinnerModel[]>} observable subject
     */
    public get latestWinsObserver(): Observable<WinnerModel[]> {
        this.runLatestStream();
        return this.latestWins$.asObservable();
    }

    /**
     * Accessor for observable subject `biggestWins$`
     * @returns {Observable<WinnerModel[]>} observable subject
     */
    public get biggestWinsObserver(): Observable<WinnerModel[]> {
        this.runBiggestStream();
        return this.biggestWins$.asObservable();
    }

    /**
     * Initiates service
     */
    protected init(): void {
        this.registerMethods();
        this.initObservers();
    }

    /**
     * Creates streams
     */
    protected initObservers(): void {
        this.biggestStream$ = this.dataService
            .getMethodSubscribe('winners/biggestWins')
            .pipe(
                takeWhile(() => !!this.biggestWins$.observers?.length),
                pairwise(),
                filter(([prev, current]: IData[]) => this.filterResponse(prev, current)),
                map(([prev, current]: IData[]) => this.mapResponse(current, WinnersServiceEvents.BIGGEST_WINS_GET)),
            );


        this.latestStream$ = this.dataService
            .getMethodSubscribe('winners/latestWins')
            .pipe(
                takeWhile(() => !!this.latestWins$.observers?.length),
                pairwise(),
                filter(([prev, current]: IData[]) => this.filterResponse(prev, current)),
                map(([prev, current]: IData[]) => this.mapResponse(current, WinnersServiceEvents.LATEST_WINS_GET)),
            );
    }

    /**
     * Subscribe on stream if no subscribers, send first request if no data
     */
    protected runLatestStream(): void {
        if (!this.latestWins$.observers?.length) {
            this.latestWins$.pipe(first()).subscribe(() => {
                this.latestStream$.subscribe((data) => this.latestWins$.next(data));
            });
        }

        if (!this.latestWins$.getValue()) {
            this.latestWins$.pipe(first()).subscribe(() => {
                this.latestWins$.next([]);
                this.fetchWinners('latestWins');
            });
        }
    }

    /**
     * Subscribe on stream if no subscribers, send first request if no data
     */
    protected runBiggestStream(): void {
        if (!this.biggestWins$.observers?.length) {
            this.biggestWins$.pipe(first()).subscribe(() => {
                this.biggestStream$.subscribe((data) => this.biggestWins$.next(data));
            });
        }

        if (!this.biggestWins$.getValue()) {
            this.biggestWins$.pipe(first()).subscribe(() => {
                this.biggestWins$.next([]);
                this.fetchWinners('biggestWins');
            });
        }
    }


    /**
     * Handles response
     * @param response - response to be processed
     * @param event - name of event
     */
    protected mapResponse(response: IData, event: string): WinnerModel[] {
        if (response) {
            const data = this.getData(response.data as IWinnerData[]);

            this.eventService.emit({
                name: event,
                data: data,
            });

            return data;
        }

        return [];
    }

    /**
     * Compares current and previous responses. If they are different or empty, returns `true`
     * @param prev - previous response
     * @param current - current response
     */
    protected filterResponse(prev: IData, current: IData): boolean {
        if (current?.data?.length) {
            const diff = prev ? _differenceWith(prev?.data, current.data, _isEqual).length : true;
            return !!diff;
        }
        return true;
    }

    /**
     * Handles data to models
     * @param data - winners array
     */
    protected getData(data: IWinnerData[]): WinnerModel[] {
        return _map(data, (item: IWinnerData) => {
            const winner = new WinnerModel(this.gameCatalogService);
            winner.data = item;
            return winner;
        }).filter((item: WinnerModel) => item.game);
    }

    protected async fetchWinners(request: string): Promise<void> {
        await this.gameCatalogService.ready;
        await this.dataService.request('winners/' + request);
    }

    /**
     * Registers request methods
     */
    protected registerMethods(): void {

        this.dataService.registerMethod({
            system: 'winners',
            name: 'latestWins',
            url: '/wins',
            type: 'GET',
            events: {
                success: WinnersServiceEvents.LATEST_WINS_SUCCESS,
                fail: WinnersServiceEvents.LATEST_WINS_ERROR,
            },
            ...this.prepareParams('latestWins'),
        });

        this.dataService.registerMethod({
            system: 'winners',
            name: 'biggestWins',
            url: '/stats/topWins',
            type: 'GET',
            events: {
                success: WinnersServiceEvents.LATEST_WINS_SUCCESS,
                fail: WinnersServiceEvents.LATEST_WINS_ERROR,
            },
            ...this.prepareParams('biggestWins'),
        });
    }

    /**
     * Prepares request params according to configuration
     * @param name - name of params by path `appConfig.$promo.winners`
     */
    protected prepareParams(name: string): IWinnersParams {
        const configParams: IWinnersParams = this.configService
            .get<IWinnersParams>(`appConfig.$promo.winners.${name}`) || {};

        return _merge({}, defaultParams[name], configParams);
    }
}

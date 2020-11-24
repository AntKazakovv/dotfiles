import {Injectable} from '@angular/core';
import {
    Observable,
    Subject,
} from 'rxjs';
import {
    tap,
    takeUntil,
} from 'rxjs/operators';
import {filter} from 'rxjs/internal/operators/filter';

import {
    ConfigService,
    DataService,
    EventService,
} from 'wlc-engine/modules/core/services';
import {
    IData,
    IRequestMethod,
    RequestParamsType,
    RestMethodType,
} from 'wlc-engine/modules/core/services/data/data.service';
import {WinnerModel} from 'wlc-engine/modules/promo/models/winner.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IWinnerData} from 'wlc-engine/interfaces';

// TODO remove later
import {lastWinsData, lastWinsData2} from './../../mocks/last-wins';

import {
    merge as _merge,
    differenceWith as _differenceWith,
    isEqual as _isEqual,
    map as _map,
} from 'lodash';

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
    LATEST_WINS_EERROR = 'LATEST_WINNERS_EERROR',
    BIGGEST_WINS_GET = 'BIGGEST_WINS_GET',
    BIGGEST_WINS_SUCCESS = 'BIGGEST_WINS_SUCCESS',
    BIGGEST_WINS_ERROR = 'BIGGEST_WINS_ERROR',
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

    /** `Observable` object for getting latest winners */
    protected $latestWins: Observable<IData>;
    /** `Observable` object for getting biggest winners */
    protected $biggestWins: Observable<IData>;

    /** `latest` last success saved response of latest winners */
    protected latest: IWinnerData[];
    /** `biggest` last success saved response of biggest winners */
    protected biggest: IWinnerData[];

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
        return this.getData(this.latest);
    }

    /**
     * Accessor for getting last response
     * @returns last success response if latest winners
     */
    public get biggestWins(): WinnerModel[] {
        return this.getData(this.biggest);
    }

    /**
     * Subscription for latest winners
     * @param until - subject which ends the subscription
     * @param callback - get winners model array
     * @example
     * this.winnersService.getLatestWins(
     *     this.$destroy,
     *     (winners: WinnerModel[]) => {
     *     // do something...
     * });
     */
    public async subscribeLatestWins(
        until: Subject<unknown>,
        callback: (winners: WinnerModel[]) => void,
    ): Promise<void> {
        await this.gameCatalogService.ready;
        this.fetchLatestWinners();

        this.$latestWins
            .pipe(takeUntil(until))
            .subscribe(() => callback(this.latestWins));
    }

    /**
     * Subscription for biggest winners
     * @param until - subject which ends the subscription
     * @param callback - get winners model array
     * @example
     * this.winnersService.getBiggestWins(
     *     this.$destroy,
     *     (winners: WinnerModel[]) => {
     *     // do something...
     * });
     */
    public async subscribeBiggestWins(
        until: Subject<unknown>,
        callback: (winners: WinnerModel[]) => void,
    ): Promise<void> {
        await this.gameCatalogService.ready;
        this.fetchBiggestWins();

        this.$biggestWins
            .pipe(takeUntil(until))
            .subscribe(() => callback(this.biggestWins));
    }

    /**
     * Initiates service
     */
    protected init(): void {
        this.registerMethods();
        this.initObservers();
    }

    /**
     * Creates observable objects
     */
    protected initObservers(): void {
        this.$latestWins = this.dataService
            .getMethodSubscribe('winners/latestWins')
            .pipe(
                filter((response: IData) => this.filterResponse(response, this.latest)),
                tap((response: IData) => this.tapResponse(response, 'latest', WinnersServiceEvents.LATEST_WINS_GET)),
            );

        this.$biggestWins = this.dataService
            .getMethodSubscribe('winners/biggestWins')
            .pipe(
                filter((response: IData) => this.filterResponse(response, this.biggest)),
                tap((response: IData) => this.tapResponse(response, 'biggest', WinnersServiceEvents.BIGGEST_WINS_GET)),
            );
    }

    /**
     * Handles response
     * @param response - response to be processed
     * @param lastResponseName - name of variable
     * @param event - name of event
     */
    protected tapResponse(response: IData, lastResponseName: string, event: string): IData {
        if (response) {
            // for test, imitation of changing data
            // const data = Math.random() > 0.5 ? lastWinsData : lastWinsData2;
            // this[lastResponseName] = data as IWinnerData[];

            this[lastResponseName] = response.data as IWinnerData[];
            this.eventService.emit({
                name: event,
                data: this.getData(this[lastResponseName]),
            });
        }
        return response;
    }

    /**
     * Compares current and last responses. If they are different, returns `true`
     * @param response - response to be compared
     * @param lastResponse - last response
     */
    protected filterResponse(response: IData, lastResponse: IWinnerData[]): boolean {
        if (response && response.data?.length) {
            const diff = _differenceWith(response.data, lastResponse, _isEqual);
            return !!diff.length;
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

    protected fetchLatestWinners(): void {
        this.dataService.request('winners/latestWins')
            .then((response: IData) => this.tapResponse(
                response, 'latest', WinnersServiceEvents.LATEST_WINS_GET,
                ));
    }

    protected fetchBiggestWins(): void {
        this.dataService.request('winners/biggestWins')
            .then((response: IData) => this.tapResponse(
                response, 'biggest', WinnersServiceEvents.BIGGEST_WINS_GET,
                ));
    }

    /**
     * Creates single request method
     * @param name - name of request
     * @param url - api url
     * @param type - type of http request
     */
    protected regMethod(
        name: string,
        url: string,
        type: RestMethodType,
        events: {success: string, fail: string},
    ): void {
        const methodParams: IRequestMethod = {
            system: 'winners',
            name,
            url,
            type,
            events,
            ...this.prepareParams(name),
        };

        this.dataService.registerMethod(methodParams);
    }

    /**
     * Registers request methods
     */
    protected registerMethods(): void {
        this.regMethod('latestWins', '/wins', 'GET', {
            success: WinnersServiceEvents.LATEST_WINS_SUCCESS,
            fail: WinnersServiceEvents.LATEST_WINS_EERROR,
        });

        this.regMethod('biggestWins', '/stats/topWins', 'GET', {
            success: WinnersServiceEvents.LATEST_WINS_SUCCESS,
            fail: WinnersServiceEvents.BIGGEST_WINS_ERROR,
        });
    }

    /**
     * Prepares request params according to configuration
     * @param name - name of params by path `appConfig.$base.statistic`
     */
    protected prepareParams(name: string): IWinnersParams {
        const configParams: IWinnersParams = this.configService
            .get<IWinnersParams>(`appConfig.$base.statistic.${name}`) || {};

        return _merge({}, defaultParams[name], configParams);
    }
}

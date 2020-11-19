import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
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
    /** Fiers after success filtered request of latest winners */
    LATEST_WINS_GET = 'LATEST_WINNERS_GET',
    /** Fiers after success filtered request of biggest winners */
    BIGGEST_WINS_GET = 'BIGGEST_WINS_GET',
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
    public latestWins: Observable<IData>;
    /** `Observable` object for getting biggest winners */
    public biggestWins: Observable<IData>;

    /** `latest` last success saved response of latest winners */
    protected latest: IWinnerData[] = [];
    /** `biggest` last success saved response of biggest winners */
    protected biggest: IWinnerData[] = [];

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
     * @returns {WinnerModel[]} last success response of latest winners
     */
    public get latestWinsData(): WinnerModel[] {
        return this.getData(this.latest);
    }

    /**
     * Accessor for getting last response
     * @returns {WinnerModel[]} last success response if latest winners
     */
    public get biggestWinsData(): WinnerModel[] {
        return this.getData(this.biggest);
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
        this.latestWins = this.dataService
            .getMethodSubscribe('winners/latestWins')
            .pipe(
                filter((response: IData) => this.filterResponse(response, this.latest)),
                tap((response: IData) => this.tapResponse(response, 'latest', WinnersServiceEvents.LATEST_WINS_GET)),
            );

        this.biggestWins = this.dataService
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
            this[lastResponseName] = response.data as IWinnerData[];
            this.eventService.emit({
                name: event,
                data: response.data as IWinnerData[],
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
        if (response) {
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
        });
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
    ): void {
        const configParams = this.prepareParams(name);
        const methodParams: IRequestMethod = {name, system: 'winners', url, type, ...configParams};

        this.dataService.registerMethod(methodParams);
    }

    /**
     * Registers request methods
     */
    protected registerMethods(): void {
        this.regMethod('latestWins', '/wins', 'GET');
        this.regMethod('biggestWins', '/stats/topWins', 'GET');
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

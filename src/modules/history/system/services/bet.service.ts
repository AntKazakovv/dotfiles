import {Injectable} from '@angular/core';

import {DateTime} from 'luxon';
import _filter from 'lodash-es/filter';
import _orderBy from 'lodash-es/orderBy';

import {
    TSortDirection,
    IData,
    DataService,
    LogService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {IBet} from 'wlc-engine/modules/profile/system/interfaces/bet.interfaces';
import {HistoryHelper} from 'wlc-engine/modules/history/system/helpers';
import {Bet} from '../models';

interface IBetRequestParams {
    endDate: string;
    startDate: string;
}

interface IGetBetsParams {
    endDate: DateTime;
    startDate: DateTime;
    orderDirection: TSortDirection;
}

@Injectable({providedIn: 'root'})
export class BetService {
    private allBets: Bet[] = [];
    private wasFirstRequest: boolean = false;

    constructor(
        protected dataService: DataService,
        private logService: LogService,
        private injectionService: InjectionService,
    ) {
        this.registerMethods();
    }

    /**
     * Set allBets field in BetService
     *
     * @param {IGetBetsParams} params
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<void>}
     */
    public async getBets(params: IGetBetsParams, needRequest: boolean): Promise<Bet[]> {
        if (needRequest || !this.wasFirstRequest) {
            const startDateUTC: DateTime = params.startDate.startOf('day').toUTC(),
                endDateUTC: DateTime = params.endDate.endOf('day').toUTC();

            this.allBets = await this.requestBetsList({
                startDate: startDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
                endDate: endDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            });

            this.allBets = _filter(this.allBets, (item: Bet): boolean => {
                const itemDateUTC: DateTime = DateTime.fromSQL(item.dateISO, {zone: 'utc'});
                return itemDateUTC >= startDateUTC && itemDateUTC <= endDateUTC;
            });

            if (!this.wasFirstRequest) {
                this.wasFirstRequest = true;
            }
        }

        return this.orderAllBets(params.orderDirection);
    }

    public resetData(): void {
        this.allBets = [];
        this.wasFirstRequest = false;
    }

    /**
     * Order allBets array in BetService
     *
     * @param {TSortDirection} order
     *
     * @returns {void}
     */
    private orderAllBets(order: TSortDirection): Bet[] {
        return order === 'desc'
            ? this.allBets
            : _orderBy(this.allBets, ['dateISO'], order);
    }

    /**
     * Request bets list by dates
     *
     * @param {IBetRequestParams} params
     *
     * @returns {Promise<Bet[]>}
     */
    private async requestBetsList(params: IBetRequestParams): Promise<Bet[]> {
        try {
            const response: IData<IBet[]> = await this.dataService.request<IData>('profile/bets', params);
            const bets: Bet[] = await HistoryHelper.conversionCurrency<Bet>(
                this.injectionService,
                (response.data) as unknown as Bet[]);
                
            return bets;
        } catch (error) {
            this.logService.sendLog({code: '22.0.0', data: error});
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'bets',
            system: 'profile',
            url: '/bets',
            type: 'GET',
            events: {
                success: 'BETS',
                fail: 'BETS_ERROR',
            },
            mapFunc: this.createBets.bind(this),
        });
    }

    private createBets(data: IBet[]): Bet[] {
        return data.map((item) => new Bet(
            {service: 'BetService', method: 'createBets'},
            item,
        ));
    }
}

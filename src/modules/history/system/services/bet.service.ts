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

    private allBets: IBet[] = [];
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
    public async getBets(params: IGetBetsParams, needRequest: boolean): Promise<IBet[]> {
        
        if (needRequest) {
            const startDateUTC: DateTime = params.startDate.startOf('day').toUTC(),
                endDateUTC: DateTime = params.endDate.endOf('day').toUTC();

            this.allBets = await this.requestBetsList({
                startDate: startDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
                endDate: endDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            });

            this.allBets = _filter(this.allBets, (item: IBet): boolean => {
                const itemDateUTC: DateTime = DateTime.fromSQL(item.DateISO, {zone: 'utc'});
                return itemDateUTC >= startDateUTC && itemDateUTC <= endDateUTC;
            });

            if (!this.wasFirstRequest) {
                this.wasFirstRequest = true;
            }
        }

        return this.orderAllBets(params.orderDirection);
    }

    /**
     * Order allBets array in BetService
     *
     * @param {TSortDirection} order
     *
     * @returns {void}
     */
    private orderAllBets(order: TSortDirection): IBet[] {
        return order === 'desc'
            ? this.allBets
            : _orderBy(this.allBets, ['DateISO'], order);
    }

    /**
     * Request bets list by dates
     *
     * @param {IBetRequestParams} params
     *
     * @returns {Promise<IBet[]>}
     */
    private async requestBetsList(params: IBetRequestParams): Promise<IBet[]> {
        try {
            const response: IData<IBet[]> = await this.dataService.request<IData>('profile/bets', params);
            const bets: IBet[] = await HistoryHelper.conversionCurrency<IBet>(this.injectionService, response.data);
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
        });
    }
}

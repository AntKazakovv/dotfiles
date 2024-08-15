import {Injectable} from '@angular/core';

import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import _filter from 'lodash-es/filter';
import _map from 'lodash-es/map';

import {
    IData,
    DataService,
    LogService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    ICashbackHistory,
} from 'wlc-engine/modules/history/system/interfaces/cashback-history/cashback-history.interface';

interface ICashbackRequestParams {
    from: string;
    to: string;
}

interface IGetCashbacksParams {
    endDate: Dayjs;
    startDate: Dayjs;
}

@Injectable({providedIn: 'root'})
export class CashbackService {

    private allCashbacks: ICashbackHistory[] = [];
    private wasFirstRequest: boolean = false;

    constructor(
        protected dataService: DataService,
        private logService: LogService,
    ) {
        this.registerMethods();
    }

    /**
     * Set allCashbacks field in CashbackService
     *
     * @param {IGetBetsParams} params
     * @param {boolean} needRequest - if date dont change we dont need a new request
     *
     * @returns {Promise<void>}
     */
    public async getCashbacks(params: IGetCashbacksParams, needRequest: boolean): Promise<ICashbackHistory[]> {
        if (needRequest) {
            const startDateUTC: Dayjs = params.startDate.startOf('day').add(-1 * dayjs().utcOffset(), 'minute'),
                endDateUTC: Dayjs = params.endDate.endOf('day').add(-1 * dayjs().utcOffset(), 'minute');

            this.allCashbacks = await this.requestCashbacksList({
                from: startDateUTC.format('YYYY-MM-DD'),
                to: endDateUTC.format('YYYY-MM-DD'),
            });
            this.allCashbacks = _filter(this.allCashbacks, (item: ICashbackHistory): boolean => {
                const itemDateUTC: Dayjs = dayjs(item.AddDate, 'YYYY-MM-DD HH:mm:ss');
                return itemDateUTC >= startDateUTC && itemDateUTC <= endDateUTC;
            });
            this.allCashbacks = _map(this.allCashbacks, (item: ICashbackHistory) => {
                item.AddDate = GlobalHelper.toLocalTime(item.AddDate, 'SQL', 'YYYY-MM-DD HH:mm:ss');
                item.PeriodFrom = dayjs(item.PeriodFrom).isValid() ?
                    GlobalHelper.toLocalTime(item.PeriodFrom, 'SQL', 'YYYY-MM-DD HH:mm:ss') :
                    item.PeriodFrom.replace(/\./g, '-');
                item.PeriodTo = dayjs(item.PeriodTo).isValid() ?
                    GlobalHelper.toLocalTime(item.PeriodTo, 'SQL', 'YYYY-MM-DD HH:mm:ss') :
                    item.PeriodTo.replace(/\./g, '-');
                item.Period = `${item.PeriodFrom} - ${item.PeriodTo}`;
                return item;
            });

            if (!this.wasFirstRequest) {
                this.wasFirstRequest = true;
            }
        }

        return this.allCashbacks;
    }

    private async requestCashbacksList(params: ICashbackRequestParams): Promise<ICashbackHistory[]> {
        try {
            const response: IData<ICashbackHistory[]> =
                await this.dataService.request<IData>('cashback/history', params);
            const cashbacks: ICashbackHistory[] = response.data;

            return cashbacks;
        } catch (error) {
            this.logService.sendLog({code: '22.0.0', data: error});
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'history',
            system: 'cashback',
            url: '/cashback/history',
            type: 'GET',
        });
    }
}

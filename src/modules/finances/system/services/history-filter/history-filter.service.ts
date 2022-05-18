import {
    Injectable,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import _assign from 'lodash-es/assign';

import {EventService} from 'wlc-engine/modules/core';
import {
    TTransactionFilter,
    TTournamentsFilter,
    TBonusFilter,
    IHistoryData,
    IFilterValue,
    IHistoryDefault,
    IFinancesFilter,
} from 'wlc-engine/modules/finances/system/interfaces/history-filter.interface';

@Injectable({
    providedIn: 'root',
})
export class HistoryFilterService {

    public dateChanges$ = new BehaviorSubject<IFinancesFilter<TTransactionFilter | string>>(null);
    protected history: IHistoryData = {
        transaction: new BehaviorSubject<IFinancesFilter<TTransactionFilter>>(null),
        bet: new BehaviorSubject<IFinancesFilter>(null),
        tournaments: new BehaviorSubject<IFilterValue<TTournamentsFilter>>(null),
        bonus: new BehaviorSubject<IFilterValue<TBonusFilter>>(null),
    };
    protected historyDefault: IHistoryDefault = {
        transaction: {
            filterValue: 'all',
            startDate: null,
            endDate: null,
        },
        bet: {
            filterValue: 'all',
            startDate: null,
            endDate: null,
        },
        tournaments: {
            filterValue: 'all',
        },
        bonus: {
            filterValue: 'all',
        },
    };

    constructor(protected eventService: EventService) {}

    /**
     * Get filter value
     * 
     * @param type {T extends keyof IHistoryDefault}
     * @returns {BehaviorSubject<IHistoryDefault[T]>} - filter value
     */
    public getFilter<T extends keyof IHistoryDefault>(type: T): BehaviorSubject<IHistoryDefault[T]> {
        return this.history[type] as BehaviorSubject<IHistoryDefault[T]>;
    }

    /**
     * Set filter value
     * 
     * @param type {T extends keyof IHistoryDefault}
     * @param data {D extends IHistoryDefault[T]}
     */
    public setFilter<T extends keyof IHistoryDefault, D extends IHistoryDefault[T]>(type: T, data: D): void {
        (this.history[type] as BehaviorSubject<D>).next(_assign(this.history[type].value, data));
    }

    /**
     * Gets the filter's default values
     * 
     * @param type {T extends keyof IHistoryDefault}
     * @returns {IHistoryDefault[T]} - filter default value
     */
    public getDefaultFilter<T extends keyof IHistoryDefault>(type: T): IHistoryDefault[T] {
        return this.historyDefault[type];
    }

    /**
     * Set default filter values
     * 
     * @param type {T extends keyof IHistoryDefault}
     * @param data {IHistoryDefault[T]}
     */
    public setDefaultFilter<T extends keyof IHistoryDefault>(type: T, data: IHistoryDefault[T]): void {
        _assign(this.historyDefault[type], data);
    }
}

import {
    Injectable,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import _assign from 'lodash-es/assign';

import {
    TTransactionFilter,
    TTournamentsFilter,
    TBonusFilter,
    IHistoryData,
    IHistoryDefault,
    IHistoryFilter,
} from 'wlc-engine/modules/history/system/interfaces/history-filter.interface';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

@Injectable({
    providedIn: 'root',
})
export class HistoryFilterService {

    public history: IHistoryData = {
        transaction: new BehaviorSubject<IHistoryFilter<TTransactionFilter>>(null),
        bet: new BehaviorSubject<IHistoryFilter>(null),
        cashback: new BehaviorSubject<IHistoryFilter>(null),
        tournaments: new BehaviorSubject<IHistoryFilter<TTournamentsFilter>>(null),
        bonus: new BehaviorSubject<IHistoryFilter<keyof typeof TBonusFilter>>(null),
        mails: new BehaviorSubject<IHistoryFilter>(null),
    };
    protected historyDefault: IHistoryDefault = {
        transaction: {
            filterValue: 'all',
            startDate: null,
            endDate: null,
        },
        bet: {
            filterValue: 'all',
            orderDirection: 'desc',
            startDate: null,
            endDate: null,
        },
        cashback: {
            startDate: null,
            endDate: null,
        },
        tournaments: {
            filterValue: 'all',
            startDate: null,
            endDate: null,
        },
        bonus: {
            filterValue: 'all',
            startDate: null,
            endDate: null,
        },
        mails: {
            startDate: null,
            endDate: null,
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

    /**
     * Set default and current filters
     *
     * @param type {T extends keyof IHistoryDefault}
     * @param data {IHistoryDefault[T]}
     */
    public setAllFilters<T extends keyof IHistoryDefault>(type: T, data: IHistoryDefault[T]): void {
        this.setDefaultFilter(type, data);
        this.setFilter(type, data);
    }
}

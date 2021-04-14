import {
    Injectable,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {EventService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

import _assign from 'lodash-es/assign';

export interface IHistoryData {
    transaction: BehaviorSubject<IIndexing<any>>;
    bonus: BehaviorSubject<IIndexing<any>>;
    bet: BehaviorSubject<IIndexing<any>>;
    tournaments: BehaviorSubject<IIndexing<any>>;
};

export type HistoryType = 'transaction' | 'bonus' | 'bet' | 'tournaments';

@Injectable({
    providedIn: 'root',
})
export class HistoryFilterService {

    public dateChanges$ = new BehaviorSubject(null);

    protected history: IHistoryData = {
        transaction: new BehaviorSubject(null),
        bonus: new BehaviorSubject(null),
        bet: new BehaviorSubject(null),
        tournaments: new BehaviorSubject(null),
    };

    protected historyDefault: IIndexing<IIndexing<any>> = {
        transaction: {
            filterType: 'all',
            endDate: undefined,
            startDate: undefined,
        },
        bet: {
            filterType: 'all',
            endDate: undefined,
            startDate: undefined,
        },
        tournaments: {
            filterType: 'all',
        },
        bonus: {
            filterType: 'all',
        },
    };

    constructor(
        protected eventService: EventService,
    ) {}

    public getFilter(type: HistoryType): BehaviorSubject<IIndexing<any>> {
        return this.history[type];
    }

    public setFilter(type: HistoryType, data: IIndexing<any>): void {
        this.history[type].next(data);
    }

    public getDefaultFilter(type: HistoryType): IIndexing<any> {
        return this.historyDefault[type];
    }

    public setDefaultFilter(type: HistoryType, data: IIndexing<any>) {
        _assign(this.historyDefault[type], data);
    }
}

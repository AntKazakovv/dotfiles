import {Injectable} from '@angular/core';
import {Subject, Observable, pipe, UnaryFunction, Subscription, PartialObserver} from 'rxjs';
import {filter} from 'rxjs/internal/operators/filter';
import {map} from 'rxjs/internal/operators/map';
import {takeUntil} from 'rxjs/internal/operators';

import {
    get as _get,
    assign as _assign,
    isArray as _isArray,
} from 'lodash';

export type EventType = 'event' | 'error' | 'system';

export interface IFilterParams {
    name: string;
    type?: EventType;
    from?: string;
    status?: string;
}

export type FilterType = Partial<IFilterParams> | Partial<IFilterParams>[];

export interface IEvent extends IFilterParams {
    data?: any;
}

@Injectable()
export class EventService {

    public get flow(): Observable<IEvent> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IEvent> = new Subject<IEvent>();

    constructor() {
    }

    public emit(event: IEvent): void {
        this.flow$.next(
            _assign({type: 'event'}, event)
        );
    }

    public filter(params: FilterType, until?: Observable<any>): Observable<IEvent> {
        return this.flow.pipe(
            (until) ? takeUntil(until) : pipe(),
            this.filterEvents(
                _isArray(params) ? params : [params]
            ),
        );
    }

    public subscribe(
        eventFilter: FilterType,
        subscriber: (data: any) => void | PartialObserver<any>,
        until?: Observable<any>
    ): Subscription {
        return this.filter(eventFilter, until)
            .pipe(
                map((event: IEvent): any => _get(event, 'data')),
            )
            .subscribe(subscriber);
    }

    private filterEvents(params: Partial<IFilterParams>[]): UnaryFunction<Observable<IEvent>, Observable<IEvent>> {
        return pipe(filter((event: IEvent) => {
            return params.reduce((result, eventFilter) => {
                return result || this.filterEvent(eventFilter, event);
            }, false);
        }));
    }

    private filterEvent(filterParam: Partial<IFilterParams>, event: IFilterParams): boolean {
        return Object.keys(filterParam).reduce((result: boolean, key: string) => {
            return result && event[key] === filterParam[key];
        }, true);
    }
}

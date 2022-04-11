import {Injectable} from '@angular/core';
import {Subject, Observable, pipe, UnaryFunction, Subscription, PartialObserver} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import _get from 'lodash-es/get';
import _assign from 'lodash-es/assign';
import _isArray from 'lodash-es/isArray';

export type EventType = 'event' | 'error' | 'system';

export interface IFilterParams {
    name: string;
    type?: EventType;
    from?: string;
    status?: string;
}

export type FilterType = Partial<IFilterParams> | Partial<IFilterParams>[];

export interface IEvent<T> extends IFilterParams {
    data?: T;
}

@Injectable()
export class EventService {

    /**
     * Observable flow of all the events
     *
     * @return {Observable<IEvent<unknown>>}
     */
    public get flow(): Observable<IEvent<unknown>> {
        return this.flow$.asObservable();
    }

    private flow$: Subject<IEvent<unknown>> = new Subject<IEvent<unknown>>();

    constructor() {
    }

    /**
     * Emits the events
     *
     * @param {IEvent<unknown>} event
     */
    public emit(event: IEvent<unknown>): void {
        this.flow$.next(
            _assign({type: 'event'}, event),
        );
    }

    /**
     * Filter the events
     *
     * @param {FilterType} type of event filter
     * @param {Observable<any>} until
     *
     * @returns {Observable<IEvent<T>>}
     */
    public filter<T>(params: FilterType, until?: Observable<any>): Observable<IEvent<T>> {
        return this.flow.pipe(
            this.filterEvents<T>(
                _isArray(params) ? params : [params],
            ),
            (until) ? takeUntil(until) : pipe(),
        );
    }

    /**
     * Subscribe to the events
     *
     * @param {FilterType} type of event filter
     * @param {(data: T) => void | PartialObserver<T>} subscriber
     * @param {Observable<any>} until
     *
     * @returns Subscription
     */
    public subscribe<T>(
        eventFilter: FilterType,
        subscriber: (data: T) => void | PartialObserver<T>,
        until?: Observable<any>,
    ): Subscription {
        return this.filter(eventFilter, until)
            .pipe(
                map((event: IEvent<T>): T => _get(event, 'data')),
            )
            .subscribe(subscriber);
    }

    private filterEvents<T>(
        params: Partial<IFilterParams>[],
    ): UnaryFunction<Observable<IEvent<T>>, Observable<IEvent<T>>> {
        return pipe(filter((event: IEvent<T>) => {
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

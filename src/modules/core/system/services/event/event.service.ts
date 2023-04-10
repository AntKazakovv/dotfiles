import {Injectable} from '@angular/core';

import {
    Observable,
    PartialObserver,
    pipe,
    Subject,
    Subscription,
    UnaryFunction,
} from 'rxjs';
import {
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _every from 'lodash-es/every';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _keys from 'lodash-es/keys';
import _omit from 'lodash-es/omit';
import _some from 'lodash-es/some';

import {HooksService} from 'wlc-engine/modules/core';

export const eventServiceHooks = {
    emit: 'emit@EventService',
};

export interface IHookEmit {
    event: TUnknownEvent;
    disable: boolean;
}

export type EventType = 'event' | 'error' | 'system';

export interface IEventFilter {
    name: string;
    type?: EventType;
    from?: string;
    status?: string;
}

export interface IEvent<T> extends IEventFilter {
    data?: T;
}

type TFilterEventsFunction<T> = UnaryFunction<Observable<IEvent<T>>, Observable<IEvent<T>>> ;

type TFiltersArray = Partial<IEventFilter>[];

type TFilterType = Partial<IEventFilter> | TFiltersArray;

type TSubscriber<T> = (data: T) => Promise<void> | void | PartialObserver<T>;

type TUnknownEvent = IEvent<unknown>;

type TUntil = Observable<unknown>;

@Injectable()
export class EventService {
    /**
     * Memoizing storage for event pipes
     */
    protected cache = new Map<string, TFilterEventsFunction<unknown>>();

    protected flow$: Subject<TUnknownEvent> = new Subject<TUnknownEvent>();

    /**
     * Observable flow of all the events
     *
     * @return {Observable<TUnknownEvent>}
     */
    public get flow(): Observable<TUnknownEvent> {
        return this.flow$.asObservable();
    }

    constructor(
        private hooksService: HooksService,
    ) {

    }

    /**
     * Emits the events
     *
     * @param {TUnknownEvent} event
     */
    public async emit(event: TUnknownEvent): Promise<void> {
        const hookData = await this.hooksService.run<IHookEmit>(
            eventServiceHooks.emit,
            {
                event: event,
                disable: false,
            },
        );

        if (!hookData.disable) {
            this.flow$.next(_assign({type: 'event'}, hookData.event));
        }
    }

    /**
     * Filter the events
     *
     * @param {TFilterType} type of event filter
     * @param {Observable<any>} until
     *
     * @returns {Observable<IEvent<T>>}
     */
    public filter<T>(filter: TFilterType, until?: TUntil): Observable<IEvent<T>> {
        return this.flow.pipe(
            this.filterEvents<T>(_isArray(filter) ? filter : [filter]),
            (until) ? takeUntil(until) : pipe(),
        );
    }

    /**
     * Subscribe to the events
     *
     * @param {TFilterType} type of event filter
     * @param {TSubscriber} subscriber
     * @param {Observable<any>} until
     *
     * @returns Subscription
     */
    public subscribe<T>(filter: TFilterType, subscriber: TSubscriber<T>, until?: TUntil): Subscription {
        return this.filter<T>(filter, until)
            .pipe(map((event: IEvent<T>): T => _get(event, 'data')))
            .subscribe(subscriber);
    }

    protected filterEvents<T>(filters: Partial<IEvent<T>>[]): TFilterEventsFunction<T> {
        const key = EventService.generateFiltersKey(filters);

        try {
            return this.getMemoized(key);
        } catch {
            const filterFunction = pipe(
                filter((event: IEvent<T>) => (
                    _some(filters, (filter: IEvent<T>) => EventService.isEventMatching(filter, event))
                )),
            );

            this.setMemoized(key, filterFunction);

            return filterFunction;
        }
    }

    protected getMemoized<T>(key: string): TFilterEventsFunction<T> {
        if (this.cache.has(key)) {
            return this.cache.get(key) as TFilterEventsFunction<T>;
        }

        throw new Error(`Cannot find memoized filter by key "${key}"`);
    }

    protected setMemoized<T>(key: string, value: TFilterEventsFunction<T>): void {
        this.cache.set(key, value);
    }

    private static generateFiltersKey<T>(filters: Partial<IEvent<T>>[]): string {
        const stringified = filters.map((item) => {
            const current = Reflect.has(item, 'data') ? _omit(item, 'data') : item;

            return JSON.stringify(
                Object.entries(current).sort((a, b) => a[0] > b[0] ? -1 : 1),
            );
        });

        return stringified.sort((a, b) => a > b ? -1 : 1).join(',');
    }

    private static isEventMatching<T>(filter: Partial<IEvent<T>>, event: IEvent<T>): boolean {
        return _every(_keys(filter), (k: string) => filter[k] === event[k]);
    }
}

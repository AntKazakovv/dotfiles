import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    IGamesFilterData,
    IGamesFilterServiceEvents,
    IIndexingFilter,
} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import _extend from 'lodash-es/extend';
import _get from 'lodash-es/get';
import _merge from 'lodash-es/merge';

export const GamesFilterServiceEvents: IGamesFilterServiceEvents = {
    FILTER_CHANGED: 'FILTER_CHANGED',
    FILTER_SEARCH: 'FILTER_SEARCH',
    FILTER_SORT: 'FILTER_SORT',
};

@Injectable({
    providedIn: 'root',
})
export class GamesFilterService {

    /**
     * Allows you to know when all the filters of this service will be ready
     */
    public $gamesFilterSubsIsReady: Subject<void> = new Subject<void>();
    /**
     * property that stores cached filters
     */
    public filterCache: IGamesFilterData;
    /**
     * Clear filterCache or not
     */
    public toClearCache$: Subject<boolean> = new Subject<boolean>();
    protected filters: IIndexingFilter = {};
    protected filterInitValues: IGamesFilterData = {
        categories: [],
        merchants: [],
        excludeCategories: [],
        excludeMerchants: [],
    };

    constructor(
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        this.init();
    }

    /**
     *
     * @param {string} filterName
     * @param {boolean} save
     * @returns {IGamesFilterData}
     */
    public get(filterName: string, save?: boolean): IGamesFilterData {
        if (save) {
            // TODO cache
            // const cachedFilter = this.filterCache.get(filterName);
            // if (cachedFilter) {
            //     this.filters[filterName] = cachedFilter;
            // }
        }

        if (!this.filters[filterName]) {
            this.filters[filterName] = _extend({}, this.filterInitValues);
        }

        return _extend({}, this.filters[filterName]);
    }

    /**
     *
     * Applies the passed filter. Can also cache this filter
     * 
     * @param {string} filterName filter name
     * @param {IGamesFilterData} filterValues filter values
     * @param {boolean} save caches passed filters
     * @returns {IGamesFilterData}
     */

    public set(filterName: string, filterValues: IGamesFilterData, save?: boolean): IGamesFilterData {
        const resultFilter: IGamesFilterData = this.filters[filterName] = _merge(
            {}, this.filterInitValues, filterValues,
        );

        if (save) {
            this.filterCache = filterValues;
        }

        this.eventService.emit({
            name: GamesFilterServiceEvents.FILTER_CHANGED,
            from: filterName,
            data: this.filterCache,
        });

        return resultFilter;
    }

    /**
     *
     * @returns {string[]}
     */
    public list(): string[] {
        const filterKeys = [];
        for (const key in this.filters) {
            if (this.filters[key]) {
                filterKeys.push(key);
            }
        }
        return _extend([], filterKeys);
    }

    /**
     *
     * @param {string} filterName
     * @param {boolean} save
     * @returns {boolean}
     */
    public delete(filterName: string, save?: boolean): boolean {
        delete this.filters[filterName];
        if (save) {
            this.filterCache = null;
        }
        return true;
    }

    /**
     *
     * @param {string} filterName
     * @param {string} query
     */
    public search(filterName: string, query: string): void {
        if (!this.filters[filterName]) {
            return;
        }
        this.filters[filterName].searchQuery = query;

        this.eventService.emit({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            from: filterName,
            data: this.filters[filterName],
        });
    }

    /**
     *
     * @param {string} filterName
     * @returns {string}
     */
    public getSearchQuery(filterName: string): string {
        if (_get(this.filters[filterName], 'searchQuery')) {
            return this.filters[filterName].searchQuery;
        }
        return '';
    }

    /**
     *
     * @param {string} filterName
     * @param {string} sortField
     */
    public sort(filterName: string, sortField: string) {
        this.eventService.emit({
            name: GamesFilterServiceEvents.FILTER_SORT,
            from: filterName,
            data: sortField,
        });
    }

    protected init(): void {
        // TODO cache
        // this.filterCache = this.CacheFactory.get('gamesFilterServiceCache');
        // if (!this.filterCache) {
        //     this.filterCache = this.CacheFactory.createCache('gamesFilterServiceCache', {
        //         deleteOnExpire: 'aggressive',
        //         maxAge: (30 * 24 * 60 * 60 * 1000),
        //         storageMode: 'sessionStorage'
        //     });
        // }
    }
}

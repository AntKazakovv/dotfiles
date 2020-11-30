import {Injectable} from '@angular/core';
import {IIndexing} from 'wlc-engine/interfaces';
import {EventService} from 'wlc-engine/modules/core/services';

import {
    IGamesFilterData,
    IGamesFilterServiceEvents,
    IIndexingFilter,
} from 'wlc-engine/modules/games/interfaces/filters.interfaces';

import {
    extend as _extend,
    get as _get,
    merge as _merge,
} from 'lodash';

export const GamesFilterServiceEvents: IGamesFilterServiceEvents = {
    FILTER_CHANGED: 'FILTER_CHANGED',
    FILTER_SEARCH: 'FILTER_SEARCH',
    FILTER_SORT: 'FILTER_SORT',
};

@Injectable({
    providedIn: 'root',
})
export class GamesFilterService {

    protected filterCache: any;
    protected filters: IIndexingFilter = {};
    protected filterInitValues: IGamesFilterData = {
        categories: [],
        merchants: [],
        excludeCategories: [],
        excludeMerchants: [],
    };

    constructor(protected eventService: EventService) {
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
     * @param {string} filterName
     * @param {IGamesFilterData} filterValues
     * @param {boolean} save
     * @returns {IGamesFilterData}
     */
    public set(filterName: string, filterValues: IGamesFilterData, save?: boolean): IGamesFilterData {
        const resultFilter: IGamesFilterData = this.filters[filterName] = _merge({}, this.filterInitValues, filterValues);

        // if (save) {
        //     // TODO
        //     // this.filterCache.put(filterName, resultFilter);
        // }

        this.eventService.emit({
            name: GamesFilterServiceEvents.FILTER_CHANGED,
            from: filterName,
            data: resultFilter,
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
            // TODO
            // this.filterCache.remove(filterName);
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

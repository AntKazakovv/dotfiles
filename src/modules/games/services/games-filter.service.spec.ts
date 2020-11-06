import {TestBed} from '@angular/core/testing';

import {GamesFilterService, GamesFilterServiceEvents} from './games-filter.service';
import {IGamesFilterData} from 'wlc-engine/modules/games/interfaces/filters.interfaces';
import {EventService} from 'wlc-engine/modules/core/services';

describe('GamesFilterService', () => {
    let service: GamesFilterService;
    let event: EventService;
    let spy = spyOn(event, 'emit');
    let query = 'query';

    const filterName = 'jackpots';
    const filter: IGamesFilterData = {
        categories: ['jackpots'],
        excludeCategories: [],
    };

    const result: IGamesFilterData = {
        categories: ['jackpots'],
        excludeCategories: [],
        excludeMerchants: [],
        merchants: [],
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GamesFilterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set filter', () => {
        expect(service.set(filterName, filter)).toEqual(result);
        expect(spy).toHaveBeenCalled();
    });

    it('should get filters list', () => {
        expect(service.list()).toEqual([filterName]);
    });

    it('should emit search event', () => {
        service.search(filterName, query);
        expect(spy).toHaveBeenCalledWith({
            name: GamesFilterServiceEvents.FILTER_SEARCH,
            data: {
                filterName,
                query,
            },
        });
    });

    it('should get search query', () => {
        expect(service.getSearchQuery(filterName)).toEqual(query);
        expect(service.getSearchQuery('bla bla bla')).toEqual('');
    });

    it('should emit sort event', () => {
        let sortField = 'sortField';
        service.search(filterName, sortField);
        expect(spy).toHaveBeenCalledWith({
            name: GamesFilterServiceEvents.FILTER_SORT,
            data: {
                filterName,
                sortField,
            },
        });
    });

    it('should delete filter', () => {
        expect(service.list().length).toEqual(1);
        expect(service.delete(filterName)).toEqual(true);
        expect(service.list().length).toEqual(0);
    });
});

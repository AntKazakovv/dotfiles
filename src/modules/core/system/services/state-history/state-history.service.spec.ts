import {TestBed} from '@angular/core/testing';
import {StateHistoryService} from './state-history.service';

describe('StateHistoryService', () => {
    let stateHistoryService: StateHistoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                StateHistoryService,
            ],
        });

        stateHistoryService = TestBed.inject(StateHistoryService);
    });

    afterEach(() => {
        stateHistoryService = null;
    });

    it('-> should be created', () => {
        expect(stateHistoryService).toBeTruthy();
    });

    it('-> should correct set first visit', () => {
        stateHistoryService.setFirstVisit('app.catalog');
        expect(stateHistoryService.checkFirstVisit('app.home')).toBeTrue();
        stateHistoryService.setFirstVisit('app.home');
        expect(stateHistoryService.checkFirstVisit('app.home')).toBeFalse();
    });
});

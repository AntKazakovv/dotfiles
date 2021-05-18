import {TestBed} from '@angular/core/testing';

import {LoyaltyLevelsService} from './loyalty-levels.service';

describe('LoyaltyLevelsService', () => {
    let service: LoyaltyLevelsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoyaltyLevelsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

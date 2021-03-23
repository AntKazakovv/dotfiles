import {TestBed} from '@angular/core/testing';

import {LimitationService} from './limitation.service';

describe('LimitationService', () => {
    let service: LimitationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LimitationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

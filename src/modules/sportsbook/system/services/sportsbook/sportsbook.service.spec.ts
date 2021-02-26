import { TestBed } from '@angular/core/testing';

import { SportsbookService } from './sportsbook.service';

describe('SportsbookService', () => {
    let service: SportsbookService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SportsbookService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

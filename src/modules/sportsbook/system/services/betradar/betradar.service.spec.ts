import { TestBed } from '@angular/core/testing';

import { BetradarService } from './betradar.service';

describe('BetradarService', () => {
    let service: BetradarService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BetradarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

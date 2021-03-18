import {TestBed} from '@angular/core/testing';

import {HooksService} from './hooks.service';

describe('HooksService', () => {
    let service: HooksService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(HooksService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

import {TestBed} from '@angular/core/testing';

import {BodyClassService} from './body-class.service';

describe('BodyClassService', () => {
    let service: BodyClassService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BodyClassService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

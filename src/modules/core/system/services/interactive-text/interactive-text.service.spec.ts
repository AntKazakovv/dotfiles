import {TestBed} from '@angular/core/testing';

import {InteractiveTextService} from './interactive-text.service';

describe('InteractiveTextService', () => {
    let service: InteractiveTextService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InteractiveTextService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

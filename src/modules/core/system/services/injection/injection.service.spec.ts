import {TestBed} from '@angular/core/testing';

import {InjectionService} from './injection.service';

describe('InjectionService', () => {
    let service: InjectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InjectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

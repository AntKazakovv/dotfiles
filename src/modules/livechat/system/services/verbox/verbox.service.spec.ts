import {TestBed} from '@angular/core/testing';
import {VerboxService} from './verbox.service';

describe('VerboxService', () => {
    let service: VerboxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VerboxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

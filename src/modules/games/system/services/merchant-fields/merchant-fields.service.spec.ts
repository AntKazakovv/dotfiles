import { TestBed } from '@angular/core/testing';

import { MerchantFieldsService } from './merchant-fields.service';

describe('MerchantFieldsService', () => {
    let service: MerchantFieldsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MerchantFieldsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

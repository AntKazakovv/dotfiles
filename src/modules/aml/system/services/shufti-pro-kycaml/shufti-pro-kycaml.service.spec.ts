import {TestBed} from '@angular/core/testing';

import {MockService} from 'ng-mocks';

import {DataService} from 'wlc-engine/modules/core';
import {ShuftiProKycamlService} from './shufti-pro-kycaml.service';

describe('ShuftiProKycamlService', () => {
    let service: ShuftiProKycamlService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: DataService,
                    useValue: MockService(DataService),
                },
                ShuftiProKycamlService,
            ],
        });
        service = TestBed.inject(ShuftiProKycamlService);
    });

    it('-> should be created', () => {
        expect(service).toBeTruthy();
    });
});

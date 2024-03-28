import {TestBed} from '@angular/core/testing';

import {MockService} from 'ng-mocks';

import {
    DataService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
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
                {
                    provide: EventService,
                    useValue: MockService(EventService),
                },
                {
                    provide: LogService,
                    useValue: MockService(LogService),
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

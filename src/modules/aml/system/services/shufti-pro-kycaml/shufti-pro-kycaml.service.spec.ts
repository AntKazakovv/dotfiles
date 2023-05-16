import {TestBed} from '@angular/core/testing';

import {AppModule} from 'wlc-engine/modules/app/app.module';
import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {ShuftiProKycamlService} from './shufti-pro-kycaml.service';

describe('ShuftiProKycamlService', () => {
    let service: ShuftiProKycamlService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppModule,
                CoreModule,
            ],
            providers: [
                ShuftiProKycamlService,
            ],
        });
        service = TestBed.inject(ShuftiProKycamlService);
    });

    it('-> should be created', () => {
        expect(service).toBeTruthy();
    });
});

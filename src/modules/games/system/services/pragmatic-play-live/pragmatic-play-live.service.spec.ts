import {TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';

import {PragmaticPlayLiveService} from './pragmatic-play-live.service';

describe('PragmaticPlayLiveService', () => {
    let service: PragmaticPlayLiveService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            providers: [PragmaticPlayLiveService],
        });
        service = TestBed.inject(PragmaticPlayLiveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

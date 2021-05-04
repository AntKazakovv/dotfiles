import {TestBed} from '@angular/core/testing';
import {LivechatincService} from './livechatinc.service';

describe('LivechatincService', () => {
    let service: LivechatincService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LivechatincService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

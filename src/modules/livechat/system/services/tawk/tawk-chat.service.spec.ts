import {TestBed} from '@angular/core/testing';
import {TawkChatService} from './tawk-chat.service';

describe('TawkChatService', () => {
    let service: TawkChatService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TawkChatService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

import {TestBed} from '@angular/core/testing';
import {CommonChatService} from './common-chat.service';

describe('CommonChatService', () => {
    let service: CommonChatService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommonChatService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

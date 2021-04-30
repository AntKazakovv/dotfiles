import {TestBed} from '@angular/core/testing';
import {ChatraService} from './chatra.service';

describe('ChatraService', () => {
    let service: ChatraService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatraService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

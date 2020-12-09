import {TestBed} from '@angular/core/testing';
import {ContactsService} from 'wlc-engine/modules/core/system/services/contacts/contacts.service';

describe('ContactsService', () => {
    let service: ContactsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ContactsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

import {TestBed} from '@angular/core/testing';

import {ContactsService} from './contacts.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';

describe('ContactsService', () => {
    let contactsService: ContactsService;
    let dataServiceSpy: jasmine.SpyObj<DataService>;

    beforeEach(() => {
        dataServiceSpy = jasmine.createSpyObj(
            'DataService',
            ['request'],
        );

        TestBed.configureTestingModule({
            providers: [
                ContactsService,
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
            ],
        });

        contactsService = TestBed.inject(ContactsService);
    });

    it('-> should be created', () => {
        expect(contactsService).toBeTruthy();
    });

    it('-> send: send e-mail',() => {
        const testData = {
            senderName: 'Test Sender',
            senderEmail: 'test@sender.com',
            subject: 'Email subject',
            message: 'This is email message',
        };

        contactsService.send(testData);

        expect(dataServiceSpy.request).toHaveBeenCalled();
        expect(dataServiceSpy.request).toHaveBeenCalledTimes(1);
        expect(dataServiceSpy.request).toHaveBeenCalledWith({
            name: 'supportEmail',
            system: 'supportEmail',
            url: '/supportEmail',
            type: 'POST',
        }, testData);
    });
});

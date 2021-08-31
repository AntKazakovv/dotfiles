import {TestBed} from '@angular/core/testing';
import {
    HttpClientTestingModule,
    HttpTestingController,
    TestRequest,
} from '@angular/common/http/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {ContactsService} from './contacts.service';

describe('ContactsService', () => {
    let contactsService: ContactsService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [ContactsService],
        });

        contactsService = TestBed.inject(ContactsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('-> should be created', () => {
        expect(contactsService).toBeTruthy();
    });

    it('-> send: send e-mail', () => {
        const testData = {
            senderName: 'Test Sender',
            senderEmail: 'test@sender.com',
            subject: 'Email subject',
            message: 'This is email message',
        };
        contactsService.send(testData);

        const req: TestRequest = httpTestingController.expectOne(
            '/api/v1/supportEmail?lang=en',
            'request to send a letter',
        );

        expect(JSON.parse(req.request.body)).toEqual(testData);
        expect(req.request.method).toEqual('POST');
        expect(req.request.url).toEqual('/api/v1/supportEmail');
    });
});

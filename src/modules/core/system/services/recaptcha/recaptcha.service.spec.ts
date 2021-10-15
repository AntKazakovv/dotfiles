import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DOCUMENT} from '@angular/common';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {RecaptchaService} from './recaptcha.service';

class GRecaptcha {
    execute = () => new Promise(resolve => resolve('test-token'));
}

describe('RecaptchaService', () => {
    let recaptchaService: RecaptchaService;
    let httpTestingController: HttpTestingController;
    let document: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [RecaptchaService],
        });

        recaptchaService = TestBed.inject(RecaptchaService);
        httpTestingController = TestBed.inject(HttpTestingController);
        document = TestBed.inject(DOCUMENT);
    });

    it('-> should be created', () => {
        expect(recaptchaService).toBeTruthy();
    });

    it('-> script connection check', () => {
        const token = recaptchaService.setToken = 'test-refresh-token';
        const script = document.querySelector('#recaptcha-script');

        expect(script).toBeTruthy();
        expect(script.getAttribute('src'))
            .toEqual(`https://www.google.com/recaptcha/api.js?render=${token}`);
    });

    it('-> token receipt check', async () => {
        (window as any).grecaptcha = new GRecaptcha();
        recaptchaService.ready.resolve();
        expect(await recaptchaService.getToken()).toEqual('test-token');
    });
});

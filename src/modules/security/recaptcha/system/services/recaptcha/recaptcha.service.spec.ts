import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DOCUMENT} from '@angular/common';

import {WINDOW} from 'wlc-engine/modules/app/system';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {RecaptchaService} from './recaptcha.service';

class GRecaptcha {
    execute = () => new Promise(resolve => resolve('test-token'));
}

describe('RecaptchaService', () => {
    let recaptchaService: RecaptchaService;
    let document: Document;
    let window: Window;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [RecaptchaService],
        });

        recaptchaService = TestBed.inject(RecaptchaService);
        document = TestBed.inject(DOCUMENT);
        window = TestBed.inject<Window>(WINDOW);
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
        window.grecaptcha = new GRecaptcha();
        recaptchaService.ready.resolve();
        expect(await recaptchaService.getToken()).toEqual('test-token');
    });
});

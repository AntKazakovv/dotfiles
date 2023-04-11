import {TestBed} from '@angular/core/testing';
import {DOCUMENT} from '@angular/common';
import {MockService} from 'ng-mocks';

import {
    WINDOW,
    WINDOW_PROVIDER,
} from 'wlc-engine/modules/app/system';
import {RecaptchaService} from './recaptcha.service';
import {ConfigService} from 'wlc-engine/modules/core';

class GRecaptcha {
    execute = () => new Promise(resolve => resolve('test-token'));
}

describe('RecaptchaService', () => {
    let recaptchaService: RecaptchaService;
    let document: Document;
    let window: Window;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                RecaptchaService,
                {
                    provide: ConfigService,
                    useValue: MockService(ConfigService),
                },
                WINDOW_PROVIDER,
            ],
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

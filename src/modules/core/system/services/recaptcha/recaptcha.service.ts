import {
    Inject,
    Injectable,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class RecaptchaService {
    /**
     * Wait for RecaptchaService is successful loaded;
     */
    public ready = new Deferred<void>();

    private recaptchaSiteKey: string;

    constructor(
        protected configService: ConfigService,
        @Inject(DOCUMENT) private document: Document,
        @Inject(WINDOW) private window: Window,
    ) {
    }

    /**
     * Get recaptcha token from google
     *
     *
     * @return Promise<string> recaptcha token
     */
    public async getToken(): Promise<string> {
        await this.ready.promise;
        return this.window.grecaptcha?.execute(this.recaptchaSiteKey,
            {action: 'submit'});
    }

    /**
     * Set recaptcha site_key from response headers x-recaptcha
     */
    public set setToken(recaptchaSiteKey) {
        this.recaptchaSiteKey = recaptchaSiteKey;
        if (!this.document.getElementById('recaptcha-script')) {
            this.init();
        }
    }

    protected async init(): Promise<void> {
        const script = this.document.createElement('script');
        script.setAttribute('id', 'recaptcha-script');
        script.innerHTML = '';
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
            this.window.grecaptcha.ready(() => {
                this.ready.resolve();
            });
        };
    }
}

import {Injectable} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';

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
        return window.grecaptcha?.execute(this.recaptchaSiteKey,
            {action: 'submit'});
    }

    /**
     * Set recaptcha site_key from response headers x-recaptcha
     */
    public set setToken(recaptchaSiteKey) {
        this.recaptchaSiteKey = recaptchaSiteKey;
        if (!document.getElementById('recaptcha-script')) {
            this.init();
        }
    }

    protected async init(): Promise<void> {
        const script = document.createElement('script');
        script.setAttribute('id', 'recaptcha-script');
        script.innerHTML = '';
        script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
            window.grecaptcha.ready(() => {
                this.ready.resolve();
            });
        };
    }
}

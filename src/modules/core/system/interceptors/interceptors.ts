import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {MocksInterceptor} from 'wlc-engine/modules/core/system/interceptors/mock.interceptor';
import {UrlInterceptor} from 'wlc-engine/modules/core/system/interceptors/url.interceptor';
import {NonceInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/nonce.interceptor';
import {FingerprintInterceptor} from 'wlc-engine/modules/core/system/interceptors/fingerprint.interceptor';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {CaptchaInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/captcha.interceptors';
import {RecaptchaInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/recaptcha.interceptors';
import {IdleInterceptor} from 'wlc-engine/modules/core/system/interceptors/idle.interceptor';
import {SessionInterceptor} from 'wlc-engine/modules/core/system/interceptors/session.interceptor';
import {TurnstileInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/turnstile.interceptor';

function initInterceptors(): Provider[] {
    const interceptors: Provider[] = [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeadersInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NonceInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: SessionInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MocksInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: FingerprintInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CaptchaInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RecaptchaInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: IdleInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TurnstileInterceptor,
            multi: true,
        },
    ];

    if (GlobalHelper.mobileAppConfig) {
        interceptors.push({
            provide: HTTP_INTERCEPTORS,
            useClass: UrlInterceptor,
            multi: true,
        });
    }

    return interceptors;
}

export const interceptors = initInterceptors();

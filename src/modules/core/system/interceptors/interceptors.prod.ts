import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {UrlInterceptor} from 'wlc-engine/modules/core/system/interceptors/url.interceptor';
import {CfErrorsInterceptor} from 'wlc-engine/modules/core/system/interceptors/cf-errors.interceptor';
import {NonceInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/nonce.interceptor';
import {FingerprintInterceptor} from 'wlc-engine/modules/core/system/interceptors/fingerprint.interceptor';
import {CaptchaInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/captcha.interceptors';
import {RecaptchaInterceptor} from 'wlc-engine/modules/core/system/interceptors/security/recaptcha.interceptors';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {IdleInterceptor} from 'wlc-engine/modules/core/system/interceptors/idle.interceptor';

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
            useClass: FingerprintInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CfErrorsInterceptor,
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

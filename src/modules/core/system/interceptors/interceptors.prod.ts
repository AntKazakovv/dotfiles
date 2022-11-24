import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {UrlInterceptor} from 'wlc-engine/modules/core/system/interceptors/url.interceptor';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {NonceInterceptor} from 'wlc-engine/modules/core/system/interceptors/nonce.interceptor';

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

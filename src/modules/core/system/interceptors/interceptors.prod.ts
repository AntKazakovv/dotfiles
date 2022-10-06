import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {UrlInterceptor} from 'wlc-engine/modules/core/system/interceptors/url.interceptor';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

function initInterceptors(): Provider[] {
    const interceptors: Provider[] = [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HeadersInterceptor,
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

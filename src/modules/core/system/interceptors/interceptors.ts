import {Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';
import {MocksInterceptor} from 'wlc-engine/modules/core/system/interceptors/mock.interceptor';

export const interceptors: Provider[] = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HeadersInterceptor,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: MocksInterceptor,
        multi: true,
    },
];

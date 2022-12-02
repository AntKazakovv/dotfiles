import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {HeadersInterceptor} from 'wlc-engine/modules/core/system/interceptors/headers.interceptor';

// TODO #448365
xdescribe('HeadersInterceptor', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: HeadersInterceptor,
                    multi: true,
                },
            ],
        });
    });
});

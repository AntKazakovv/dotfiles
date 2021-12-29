import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    Observable,
    throwError,
    from,
} from 'rxjs';
import {
    catchError,
    switchMap,
} from 'rxjs/operators';

import {RecaptchaService} from 'wlc-engine/modules/core/system/services/recaptcha/recaptcha.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(
        private recaptchaService: RecaptchaService,
        private logService: LogService,
        @Inject(WINDOW) private window: Window,
    ) {
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {
        if (req.url.includes('/api/v1/')) {
            req = req.clone({
                headers: req.headers.set('HTTP_X_UA_FINGERPRINT', this.window['fingerprintHash'] || ''),
            });
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.headers.get('X-RECAPTCHA') && !req.headers.get('X-RECAPTCHA')) {
                    try {
                        this.recaptchaService.setToken = error.headers.get('X-RECAPTCHA');
                        return from(this.recaptchaService.getToken()).pipe(switchMap((value: string) => {
                            req = req.clone({
                                headers: req.headers.set('X-RECAPTCHA', value),
                            });
                            return next.handle(req);
                        }));
                    } catch (error) {
                        this.logService.sendLog({
                            data: error,
                            code: '1.6.0',
                            from: {
                                interceptor: 'HeadersInterceptor',
                            },
                        });
                        console.error(error);
                    }
                } else return throwError(error);
            }),
        );
    }
}

import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    Observable,
    throwError,
    from,
} from 'rxjs';
import {
    catchError,
    switchMap,
} from 'rxjs/operators';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {RecaptchaService} from 'wlc-engine/modules/security/recaptcha';

@Injectable()
export class RecaptchaInterceptor implements HttpInterceptor {

    private recaptchaService?: RecaptchaService;

    constructor(
        private logService: LogService,
        private configService: ConfigService,
        private injectionService: InjectionService,
    ) {
        (async () => {
            await this.configService.ready;
            if (this.configService.get<boolean>('appConfig.useRecaptcha')) {
                this.recaptchaService = await this.injectionService.getService('recaptcha.recaptcha-service');
            }
        })();
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (!this.recaptchaService) {
            return next.handle(req);
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
                } else {
                    return throwError(() => error);
                }
            }),
        );
    }
}

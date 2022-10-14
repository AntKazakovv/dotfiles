import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
    HttpResponse,
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
    tap,
} from 'rxjs/operators';
import _get from 'lodash-es/get';

import {RecaptchaService} from 'wlc-engine/modules/core/system/services/recaptcha/recaptcha.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {CaptchaService} from 'wlc-engine/modules/core/system/services/captcha/captcha.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(
        @Inject(WINDOW) private window: Window,
        private recaptchaService: RecaptchaService,
        private logService: LogService,
        private captchaService: CaptchaService,
        private configService: ConfigService,
    ) {
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.configService.get<boolean>('$base.site.useXNonce')) {
            const xNonce: string = this.configService.get<string>({name: 'X-Nonce', storageType: 'localStorage'});

            if (xNonce) {
                req = req.clone({
                    headers: req.headers.set('X-Nonce', xNonce),
                });
            }
        }

        if (req.url.includes('/static/languages/') && GlobalHelper.mobileAppConfig?.translationsDomain) {
            let urlPath: string;

            if (req.url.indexOf('.') === 0) {
                urlPath = req.url.substr(1);
            } else {
                urlPath = new URL(req.url).pathname;
            }

            req = req.clone({
                url: GlobalHelper.mobileAppConfig.translationsDomain + urlPath,
            });
        }

        if (req.url.includes('/api/v1/auth') && this.captchaService.captchaCode) {
            req = req.clone({
                headers: req.headers.set('X-Captcha', this.captchaService.captchaCode),
            });
            this.captchaService.captchaCode = null;
        }

        if (req.url.includes('/api/v1/')) {
            req = req.clone({
                headers: req.headers.set('X-UA-Fingerprint', this.window['fingerprintHash'] || ''),
            });

            const jwtAuthToken: string = this.configService.get({
                name: 'jwtAuthToken',
                storageType: 'localStorage',
            });

            if (jwtAuthToken) {
                req = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${jwtAuthToken}`),
                });
            }

        }
        return next.handle(req).pipe(
            tap (
                (event) => {
                    if (event instanceof HttpResponse && req.url.includes('/api/v1/auth')) {
                        const jwtToken: string = _get(event, 'body.data.result.jwtToken', '');
                        const jwtRefreshToken = _get(event, 'body.data.result.refreshToken', '');

                        if (jwtToken) {
                            this.configService.set({
                                name: 'jwtAuthToken',
                                value: jwtToken,
                                storageType: 'localStorage',
                            });
                        } else {
                            this.configService.set({
                                name: 'jwtAuthToken',
                                value: jwtToken,
                                storageClear: 'localStorage',
                            });
                        }

                        if (jwtRefreshToken) {
                            this.configService.set({
                                name: 'jwtAuthRefreshToken',
                                value: _get(event, 'body.data.result.refreshToken', ''),
                                storageType: 'localStorage',
                            });
                        } else {
                            this.configService.set({
                                name: 'jwtAuthRefreshToken',
                                value: _get(event, 'body.data.result.refreshToken', ''),
                                storageClear: 'localStorage',
                            });
                        }
                    }
                },
            ),
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

import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import {
    Inject,
    Injectable,
} from '@angular/core';

import {
    Observable,
    throwError,
} from 'rxjs';
import {
    catchError,
    tap,
} from 'rxjs/operators';
import _get from 'lodash-es/get';

import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    constructor(
        @Inject(WINDOW) private window: Window,
        private configService: ConfigService,
    ) {
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

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

        if (req.url.includes('/api/v1/')) {
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
                if (error.url.includes('/api/v1/auth') && req.method === 'DELETE') {
                    const cookies = document.cookie.split(';');
                    cookies.forEach((cookie: string) => this.window.WlcCookie.delete(cookie));
                    this.window.location.reload();
                }

                return throwError(() => error);
            }),
        );
    }
}

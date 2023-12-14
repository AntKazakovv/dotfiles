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
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

    private useJwtToken: boolean = false;

    constructor(
        @Inject(WINDOW) protected window: Window,
        protected configService: ConfigService,
    ) {
        this.useJwtToken = this.configService.get<boolean>('$base.site.useJwtToken');
    }

    @CustomHook('core', 'headersInterceptorIntercept')
    public intercept(
        req: HttpRequest<string>,
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

        if (req.url.includes('/api/v1/') && this.useJwtToken) {
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

        if (this.useJwtToken && req.url === '/api/v1/auth') {
            req = req.clone({
                params: req.params.set('useJwt', 1),
            });
            if (req.body) {
                const body = JSON.parse(req.body);
                body.useJwt = 1;

                req = req.clone({
                    body: JSON.stringify(body),
                });
            }
        }
        return next.handle(req).pipe(
            tap (
                (event) => {
                    if (event instanceof HttpResponse
                        && this.useJwtToken
                        && req.url.includes('/api/v1/auth')
                    ) {
                        const jwtToken: string = _get(event, 'body.data.result.jwtToken', '');
                        const jwtRefreshToken: string = _get(event, 'body.data.result.refreshToken', '');
                        this.configService.updateJwtTokens(jwtToken, jwtRefreshToken);
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

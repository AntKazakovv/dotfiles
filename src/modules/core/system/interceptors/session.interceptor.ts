import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    catchError,
    Observable,
    throwError,
} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {UserService} from 'wlc-engine/modules/user';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {

    constructor(
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.userService.isAuth$.getValue()) {
            const xSession: string = this.configService.get<string>({
                name: 'X-Sessiontrace',
                storageType: 'sessionStorage',
            });

            if (xSession && !req.url.includes('agstatic')) {
                req = req.clone({headers: req.headers.set('X-Sessiontrace', xSession)});
            }
        }

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                return throwError(() => err);
            }),
        );
    }
}

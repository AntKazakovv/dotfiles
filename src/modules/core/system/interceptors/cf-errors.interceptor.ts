import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    catchError,
    Observable,
    tap,
    throwError,
} from 'rxjs';

import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';

@Injectable()
export class CfErrorsInterceptor implements HttpInterceptor {
    private counter: number = 0;

    constructor(
        private logService: LogService,
        private stateService: StateService,
    ) {}

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        return next.handle(req).pipe(
            tap (
                (event: HttpEvent<IData>): void => {
                    if (event instanceof HttpResponse && this.counter && event.status === 200) {
                        this.counter = 0;
                    }
                },
            ),
            catchError((err: HttpErrorResponse): Observable<never> => {
                if (err.status === 503  && ++this.counter >= 5) {
                    this.stateService.go('app.something-wrong');

                    this.logService.sendLog({code: '7.1.0'});

                } else {
                    return throwError(() => err);
                }
            }),
        );
    }
}

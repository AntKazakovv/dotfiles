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

import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {UserService} from 'wlc-engine/modules/user';

@Injectable()
export class NonceInterceptor implements HttpInterceptor {

    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private modalService: ModalService,
        private logService: LogService,
    ) {}

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

        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {

                if (
                    this.configService.get<boolean>('$base.site.useXNonce')
                    && this.configService.get<boolean>('$user.isAuthenticated')
                    && err.error?.code === 403
                    && err.error?.errors?.[0] === 'Wrong nonce'
                ) {

                    this.modalService.showModal({
                        id: 'login-error',
                        modalTitle: gettext('Sorry, something went wrong!'),
                        modalMessage: gettext(
                            'Something went wrong during login process. '
                            + 'Please check the correctness of the entered data and try again.',
                        ),
                        textAlign: 'center',
                    });

                    this.logService.sendLog({code: '1.8.0', data: err});

                    this.userService.logout();
                } else {
                    return throwError(() => err);
                }
            }),
        );
    }
}

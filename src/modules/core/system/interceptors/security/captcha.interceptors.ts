import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    first,
    Observable,
} from 'rxjs';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {CaptchaService} from 'wlc-engine/modules/security/captcha';

@Injectable()
export class CaptchaInterceptor implements HttpInterceptor {

    private captchaService?: CaptchaService;

    constructor(
        private eventService: EventService,
        private injectionService: InjectionService,
    ) {
        this.eventService.filter({
            name: 'CAPTCHA_ERROR',
        })
            .pipe(first())
            .subscribe({
                next: async () => {
                    this.captchaService =
                        await this.injectionService.getService<CaptchaService>('captcha.captcha-service');
                },
            });
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (
            this.captchaService &&
            this.captchaService.captchaCode &&
            req.url.includes('/api/v1/auth')
        ) {
            req = req.clone({
                headers: req.headers.set('X-Captcha', this.captchaService.captchaCode),
            });
            this.captchaService.captchaCode = null;
        }

        return next.handle(req);
    }
}

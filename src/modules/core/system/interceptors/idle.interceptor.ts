import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    Observable,
    from,
    lastValueFrom,
} from 'rxjs';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IdleService} from 'wlc-engine/modules/user/system/services/idle/idle.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

@Injectable()
export class IdleInterceptor implements HttpInterceptor {

    private useAutoLogout: boolean = null;
    private idleService: IdleService = null;

    constructor(
        private configService: ConfigService,
        private injectionService: InjectionService,
    ) {
        (async () => {
            this.useAutoLogout = this.configService.get<string>('appConfig.license') === 'italy'
                || this.configService.get('$base.profile.autoLogout.use');
            this.idleService = await this.injectionService.getService<IdleService>('user.idle-service');
        })();
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.useAutoLogout && req.url === '/api/v1/userInfo') {
            return from(this.addHashActivity(req, next));
        }

        return next.handle(req);
    }

    private async addHashActivity(req: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<IData>> {
        req = req.clone({
            headers: req.headers.set('X-HasActivity', String(this.idleService.isActivityAfterSendUserInfo)),
        });

        this.idleService.isActivityAfterSendUserInfo = false;

        return lastValueFrom(next.handle(req));
    }
}

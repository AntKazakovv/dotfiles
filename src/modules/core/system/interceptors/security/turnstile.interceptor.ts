import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {
    Injectable,
    inject,
} from '@angular/core';

import {
    Observable,
    from,
    lastValueFrom,
    firstValueFrom,
} from 'rxjs';

import {TurnstileService} from 'wlc-engine/modules/security/turnstile/system/services';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';

@Injectable()
export class TurnstileInterceptor implements HttpInterceptor {
    protected readonly injectionService: InjectionService = inject(InjectionService);
    protected turnstileService: TurnstileService;
    private _useTurnstile: boolean = false;

    protected get useTurnstile(): boolean {
        return this._useTurnstile;
    }

    constructor(protected configService: ConfigService) {
        this.init();
    }

    public intercept(
        req: HttpRequest<string>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {
        if (this.useTurnstile
            && (req.url === '/api/v1/profiles' && req.method === 'POST')
                || (req.url === '/api/v1/auth' && req.method === 'PUT')
        ) {
            return from(this.getToken(req, next));
        }

        return next.handle(req);
    }

    private async init(): Promise<void> {
        this._useTurnstile = this.configService.get('appConfig.objectData.turnstile.isEnabled');

        if (this._useTurnstile) {
            this.turnstileService = await this.injectionService
                .getService<TurnstileService>('turnstile.turnstile-service');
        }
    }

    private async getToken(req: HttpRequest<string>, next: HttpHandler): Promise<HttpEvent<IData>> {
        const body = JSON.parse(req.body);
        const token = await firstValueFrom(this.turnstileService.tokenReceived);
        body.tsToken = token;

        req = req.clone({
            body: JSON.stringify(body),
        });

        return lastValueFrom(next.handle(req));
    }
}

import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    from,
    lastValueFrom,
    Observable,
} from 'rxjs';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    configUrlForFingerprint,
    FingerprintService,
    IData,
} from 'wlc-engine/modules/core/system/services';

@Injectable()
export class FingerprintInterceptor implements HttpInterceptor {

    constructor(
        private fingerprintService: FingerprintService,
    ) {}

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.isUrlForFingerprint(req)) {
            return from(this.addHashToRequest(req, next));
        }

        return next.handle(req);
    }

    protected async addHashToRequest(req: HttpRequest<unknown>, next: HttpHandler): Promise<HttpEvent<IData>> {
        const hash = await this.fingerprintService.getFingerprintHash();

        let request = _cloneDeep(req);
        const headers = request.headers.set('X-UA-Fingerprint', hash);
        request = request.clone({
            headers,
        });

        return lastValueFrom(next.handle(request));
    }

    protected isUrlForFingerprint(req: HttpRequest<IData>): boolean {
        return Object.keys(configUrlForFingerprint).some((url: string) => {
            return req.url === `/api/v1/${url}` && configUrlForFingerprint[url]?.includes(req.method);
        });
    }
}

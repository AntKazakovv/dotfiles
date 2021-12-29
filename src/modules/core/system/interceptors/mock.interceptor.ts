import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpResponse,
    HttpClient,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    from,
    Observable,
    of,
} from 'rxjs';
import {
    switchMap,
} from 'rxjs/operators';
import _keys from 'lodash-es/keys';

import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IMocksConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/mocks.interface';
import {MOCKS_DATA} from 'wlc-engine/system/mocks';

export type TBaseMock = keyof IMocksConfig['base'];
@Injectable()
export class MocksInterceptor implements HttpInterceptor {
    private base: TBaseMock[];
    private custom: IMocksConfig['custom'];

    constructor(
        protected configService: ConfigService,
        protected httpClient: HttpClient,
    ) {
        const {base, custom} = this.configService.get<IMocksConfig>('$base.mocks') || {};
        this.custom = custom;
        this.base = (_keys(base).filter(item => base[item])) as TBaseMock[];
    }

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.custom) {
            const customMock = this.custom.find(({route}) => {
                return req.url.includes(route);
            });

            if (customMock) {
                return from(this.httpClient.get(customMock.source)).pipe(switchMap((value: IData) => {
                    return of(new HttpResponse({
                        status: 200,
                        body: value,
                    }));
                }));
            }
        }

        if (this.base.length && req.url.includes('api/v1/')) {
            const route = this.base.find(key => {
                return req.url.includes(key);
            });

            if (route) {
                req = req.clone({
                    body: MOCKS_DATA[route] as IData,
                });

                return of(new HttpResponse(req));
            }
        }

        return next.handle(req);
    }
}

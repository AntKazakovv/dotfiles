import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
} from '@angular/common/http';
import {
    Injectable,
} from '@angular/core';

import {
    Observable,
} from 'rxjs';
import _trimStart from 'lodash-es/trimStart';
import _startsWith from 'lodash-es/startsWith';

import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
    private appApiUrl: string = GlobalHelper.mobileAppApiUrl;

    public intercept(
        req: HttpRequest<IData>,
        next: HttpHandler,
    ): Observable<HttpEvent<IData>> {

        if (this.appApiUrl && (_startsWith(req.url, '/') || _startsWith(req.url, './'))) {
            let requestUrl: string;

            if (req.url.indexOf('app-static') > 0) {
                requestUrl = req.url.replace('app-static', 'static');
            } else {
                requestUrl = this.appApiUrl + '/' + _trimStart(req.url, './');
            }

            req = req.clone({
                url: requestUrl,
            });
        }
        return next.handle(req);
    }
}

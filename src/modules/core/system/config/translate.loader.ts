import {
    MissingTranslationHandler,
    MissingTranslationHandlerParams,
    TranslateLoader,
} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';
import {
    timeout,
    catchError,
} from 'rxjs/operators';

export class TranslateFallbackHttpLoader implements TranslateLoader {

    private static readonly WAIT_FOR_SERVER = 2000;

    constructor(
        private http: HttpClient,
        private prefix: string,
        private suffix: string,
    ) {}

    public getTranslation(lang: string): Observable<Object> {

        return this.http.get(`${this.prefix}${lang}${this.suffix}`)
            .pipe(
                timeout(TranslateFallbackHttpLoader.WAIT_FOR_SERVER),
                catchError(() => {
                    return this.http.get(`${this.prefix}en${this.suffix}`);
                }),
            );
    }
}

export function HttpLoaderFactory(http: HttpClient): TranslateFallbackHttpLoader {
    return new TranslateFallbackHttpLoader(http, './static/languages/', `.json?v=${WLC_VERSION}`);
}

export class MissingTranslationService implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams): string {

        return params.interpolateParams
            ? params.translateService.parser.interpolate(params.key, params.interpolateParams)
            : params.key;
    }
}

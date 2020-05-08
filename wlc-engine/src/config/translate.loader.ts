import {Injectable} from '@angular/core';
import {
    TranslateLoader,
    MissingTranslationHandler,
    MissingTranslationHandlerParams
} from '@ngx-translate/core';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function serverTranslateFactory() {
    return new ServerTranslateLoader();
}

@Injectable()
export class ServerTranslateLoader implements TranslateLoader {
    constructor() {}

    public getTranslation(lang: string): Observable<{[key: string]: string}> {
        return new Observable(observer => {
            const assetsFolder = join(process.cwd(), 'roots/static/languages');
            try {
                const jsonData = JSON.parse(readFileSync(`${assetsFolder}/${lang}.json`, 'utf8'));
                observer.next(jsonData);
                observer.complete();
            } catch (error) {
                observer.error(error);
            }
        });
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './static/languages/', '.json');
}

export class MissingTranslationService implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return params.key;
    }
}

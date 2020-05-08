import {Injectable} from '@angular/core';
import {
    TranslateLoader,
} from '@ngx-translate/core';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Observable} from 'rxjs';

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

import {HttpClient, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {filter as _filter, find as _find, includes as _includes, union as _union,} from 'lodash';
import {IIndexingString} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core';

@Injectable({
    providedIn: 'root'
})
export class StaticService {

    protected cacheMaxAge = 10 * 60 * 1000;
    protected apiUrl: string;
    protected useWpPlugin: boolean;
    protected wpPluginList: string[] = [];
    protected configReady: Promise<boolean>;
    protected params: any = {};

    protected fieldsList: string[] = [
        'id',
        'date',
        'slug',
        'title',
        'content',
        'image',
    ];

    constructor(
        protected configService: ConfigService,
        private httpClient: HttpClient,
    ) {
        this.configReady = this.setConfig();
    }

    public async getStaticData(params: any): Promise<any> {

        // if (!slug) {
        //     return Promise.reject();
        // }

        // await this.configReady;
        //
        // lang = lang || this.LanguageService.getCurrentLanguage().code.split('-').shift();
        //
        // const slugPages = this.getSlugPages(isPageType),
        //     wpLink: string = this.getWPLink(slug, slugPages, isPageType),
        //     restURL: string = `${this.apiUrl}/${wpLink}`;
        //
        // const params = _merge({slug, lang}, this.params);
        //
        // const cacheKey = restURL + JSON.stringify(params);
        //
        // return new Promise(async (resolve, reject) => {
        //     if (useCache && this.SessionCacheService.get(cacheKey)) {
        //         resolve(new CacheTextData({data: this.SessionCacheService.get(cacheKey)}));
        //     } else {
        //         try {
        //             const result = await this.$http.get(restURL, {params});
        //             const data = this.prepareTextData(result);
        //
        //             if (!data) {
        //                 reject(new Error('No content data'));
        //                 return;
        //             }
        //
        //             if (useCache) {
        //                 this.SessionCacheService.set(cacheKey, data, {maxAge: this.cacheMaxAge});
        //             }
        //             resolve(data);
        //         } catch (error) {
        //             reject(error);
        //         }
        //     }
        // });
    }

    protected async setConfig(): Promise<boolean> {
        try {
            this.useWpPlugin = await this.checkPlugin('wlc-api');
        } catch {
            this.useWpPlugin = false;
        }
        this.apiUrl = this.useWpPlugin ? '/content/wp-json/wp-wlc-api/v1' : '/content//wp-json/wp/v2';
        this.params = this.getParams();
        return Promise.resolve(true);
    }

    protected async checkPlugin(plugin?: string): Promise<boolean> {
        if (this.configService.appConfig.$static?.wpPlugins?.wlcApi === false) {
            return false;
        }

        return new Promise((resolve, reject) => {
            const request = new HttpRequest('GET', '/content/wp-json/wp-wlc-api/v1/active-plugins/');
            this.httpClient.request<HttpRequest<string>>(request).toPromise().then((response: any) => {
                if (plugin) {
                    const rx = new RegExp(`^${plugin}\/`);
                    if (!!_find(response.data, (item) => rx.test(item))) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }
            }, () => {
                reject(false);
            });
        });
    }

    protected getParams(): IIndexingString {
        const fields = this.configService.appConfig.$static?.additionalFields;
        return (this.useWpPlugin)
            ? {
                fields: _filter(fields, (item) => !_includes(this.fieldsList, item)).join(','),
            }
            : {
                _fields: _union(fields, this.fieldsList, ['_embedded', '_links']).join(','),
                context: 'view',
                _embed: '1',
            };
    }

}

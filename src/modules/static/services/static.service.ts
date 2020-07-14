import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {filter as _filter, find as _find, includes as _includes, merge as _merge, union as _union, get as _get} from 'lodash';

import {IIndexingString} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core';
import {IStaticRequestParams} from 'wlc-engine/modules/static';
import {TextDataModel, WlcTextData, WpTextData} from 'wlc-engine/modules/static';

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
        protected translateService: TranslateService
    ) {
        this.configReady = this.setConfig();
    }

    public async getStaticData(params: IStaticRequestParams): Promise<TextDataModel> {
        if (!params.slug) {
            return Promise.reject();
        }

        await this.configReady;
        const lang = params.lang || this.translateService.currentLang.split('-').shift();

        const restURL = `${this.apiUrl}/${this.getWPLink(params)}`,
            cacheKey = restURL + JSON.stringify(params);

        return new Promise(async (resolve, reject) => {
            //     if (useCache && this.SessionCacheService.get(cacheKey)) {
            //         resolve(new CacheTextData({data: this.SessionCacheService.get(cacheKey)}));
            //     } else {
            try {
                const httpRequestParams = new HttpRequest('GET', restURL, {
                    params: new HttpParams({
                        fromObject: _merge({slug: params.slug, lang}, this.params)
                    })
                });
                this.httpClient.request(httpRequestParams).toPromise().then((response: HttpResponse<any>) => {
                    const data = this.prepareTextData(response.body);
                    if (!data) {
                        reject(new Error('No content data'));
                        return;
                    }
                    // if (useCache) {
                    //     this.SessionCacheService.set(cacheKey, data, {maxAge: this.cacheMaxAge});
                    // }
                    resolve(data);
                });
            } catch (error) {
                reject(error);
            }
            //     }
        });
    }

    public getPost(slug: string): Promise<TextDataModel> {
        return this.getStaticData({
            type: 'post',
            slug,
        });
    }

    public getPage() {

    }

    protected getSlugPages(isPage: boolean): string[] {
        if (isPage) {
            return [];
        }
        return this.configService.appConfig.$static?.pagesOnly;
    }

    protected getWPLink(params: IStaticRequestParams): string {
        const postfix = this.useWpPlugin ? '' : 's';
        return params.type + postfix;
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

    protected prepareTextData(result: any): TextDataModel {
        let res: TextDataModel;

        if (this.useWpPlugin) {
            if (_get(result, 'data.code')) {
                return;
            }
            res = new WlcTextData({data: result.data}, this.configService);
        } else {
            if (!_get(result, '[0]')) {
                return;
            }
            res = new WpTextData(result[0], this.configService);
        }
        return res;
    }

}

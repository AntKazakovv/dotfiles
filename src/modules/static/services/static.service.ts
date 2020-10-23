import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';

import {IIndexingString} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core';
import {
    ICategoryStaticText,
    IParamsStaticText,
    IPostResponse,
    IRequestUrlStaticText,
    ISearchStaticText,
    IStaticRequestParams,
    ITagStaticText,
    StaticTextType,
    TextDataModel,
    WlcTextData,
    WpTextData,
} from 'wlc-engine/modules/static';

import {
    filter as _filter,
    find as _find,
    includes as _includes,
    merge as _merge,
    union as _union,
    camelCase as _camelCase,
    extend as _extend,
    isArray as _isArray,
    map as _map,
    replace as _replace,
    join as _join,
    isNumber as _isNumber,
    forEach as _forEach,
} from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class StaticService {
    protected cacheMaxAge = 10 * 60 * 1000;
    protected apiUrl: string;
    protected useWpPlugin: boolean;
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
        protected translateService: TranslateService,
        protected sanitizer: DomSanitizer,
    ) {
        this.configReady = this.setConfig();
    }

    public async getStaticText(slug: string): Promise<TextDataModel> {
        const searchPath: ISearchStaticText[] = [];
        const lang: string = this.translateService.currentLang;

        if (!this.useWpPlugin && this.configService.appConfig.siteconfig?.splittedStaticTexts?.[_camelCase(slug)]) {
            const defaultLanguage: string = this.configService.appConfig.siteconfig?.splittedStaticTexts?.defaultLanguage || 'en';

            searchPath.push({slug: `${slug}_${lang}`, lang: lang});
            searchPath.push({slug: `${slug}_${lang}`, lang: defaultLanguage});
            searchPath.push({slug: `${slug}_${defaultLanguage}`, lang: defaultLanguage});
        } else {
            searchPath.push({slug, lang});
        }

        let result: TextDataModel;

        for (const path of searchPath) {
            try {
                result = await this.getStaticData({
                    type: 'post',
                    slug: path.slug,
                    lang: path.lang,
                });

                if (!_includes(result?.htmlRaw, 'Empty page')
                    && !_includes(result?.htmlRaw, 'qtranxs-available-languages-message')) {
                    break;
                }
            } catch (error) {
                result = null;
            }
        }

        if (!result || _includes(result?.htmlRaw, 'Empty page')) {
            return;
        }

        return result;
    }

    public getPost(slug: string): Promise<TextDataModel> {
        return this.getStaticData({
            type: 'post',
            slug,
        });
    }

    public getTags(params: IParamsStaticText): Promise<ITagStaticText[]> {
        return this.getData<ITagStaticText>('tag', params);
    }

    public getPosts(params: IParamsStaticText): Promise<IPostResponse[]> {
        return this.getData<IPostResponse>('post', params);
    }

    public getPostData(slug: string, params: IParamsStaticText = {}): Promise<IPostResponse[]> {
        return this.getData<IPostResponse>('post', _extend({
            slug,
        }, params));
    }

    public async getPostsListByCategory(
        category: string | string[],
        params: IParamsStaticText,
        all = true,
    ): Promise<IPostResponse[]> {
        try {
            if (all && !_isArray(category)) {
                const categories: ICategoryStaticText[] = await this.getSubCategories(category);
                const parentCatId: number = await this.getCategoryIdBySlug(category);
                const catsId = _map(categories, (item) => +item.id);

                catsId.push(parentCatId);
                return await this.getList(catsId, params);
            } else if (_isArray(category)) {
                const currentCategoryId: number = await this.getCategoryIdBySlug(category);
                return await this.getList([+currentCategoryId], params);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getCategories(params: IParamsStaticText = {}): Promise<ICategoryStaticText[]> {
        return await this.getData<ICategoryStaticText>('categories', params);
    }

    public async getSubCategories(slug: string | string[]): Promise<ICategoryStaticText[]> {
        const subCategories: ICategoryStaticText[] = [];

        try {
            const parentId = await this.getCategoryIdBySlug(slug);

            if (!_isNumber(parentId)) {
                return;
            }

            const list: ICategoryStaticText[] = await this.getCategories();

            if (_isArray(list)) {
                _forEach(list, (item: ICategoryStaticText) => {
                    const id = item.slug === 'news' ? item.id : item.parent;

                    if (id === parentId) {
                        subCategories.push(item);
                    }
                });
            }

            return subCategories;

        } catch (error) {
            // this.errorService.logError({code: '5.0.5', data: error});
            return Promise.reject(error);
        }
    }

    public async getCategoryIdBySlug(slug: string | string[]): Promise<number> {
        try {
            const response: ICategoryStaticText[] = await this.getCategories();

            if (!_isArray(response)) {
                return Promise.reject('Not array');
            } else {
                if (!_isArray(slug)) {
                    for (const res of response) {
                        if (res.slug === slug) {
                            return res.id;
                        }
                    }

                    return Promise.reject(false);
                } else {
                    let parentId: number;

                    for (const res of response) {
                        if (res.slug === slug[0]) {
                            parentId = res.id;
                            break;
                        }
                    }

                    if (slug[0] == slug[1]) {
                        return parentId;
                    }

                    if (parentId) {
                        for (const res of response) {
                            if (res.slug === slug[1] && res.parent === parentId) {
                                return res.id;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            // this.errorService.logError({code: '5.0.4', data: error});
            return Promise.reject(error);
        }
    }

    protected async getStaticData(params: IStaticRequestParams): Promise<TextDataModel> {
        if (!params.slug) {
            return Promise.reject();
        }
        await this.configReady;

        try {
            const response = await this.requestData<IPostResponse>(params);
            const data: TextDataModel = this.prepareTextData(response.body);
            if (!data) {
                throw new Error('No content data');
            }

            return data;
        } catch (e) {
            // logService
        }
    }

    protected async getData<T>(type: StaticTextType, params: IParamsStaticText): Promise<T[]> {
        const reqParams: IStaticRequestParams = _merge(params, {
            _embed: 1,
            callback: '_jsonp',
        });

        try {
            const response = await this.requestData<IPostResponse>(reqParams);
            const data: TextDataModel = this.prepareTextData(response.body);

            if (!_isArray(data)) {
                // this.errorService.logError({code: '5.0.3'});
                return Promise.reject();
            }

            return _map(data, (item) => {
                if (item.title) {
                    item.title.rendered = this.cleanText(item.title.rendered);
                }

                if (item.content) {
                    item.content.rendered = this.cleanText(item.content.rendered);
                }

                if (item._embedded?.['wp:featuredmedia']) {
                    for (const media of item._embedded['wp:featuredmedia']) {
                        if (media.media_type === 'image' && media.source_url) {
                            let imgPath: string = media.source_url;

                            const sourceUrl =
                                _includes(media.source_url, 'wlc_') ||
                                _includes(media.source_url, 'tk_');

                            if (sourceUrl) {
                                const qaHost: string = `https://qa-${location.hostname.split('-')[1]}`;
                                imgPath = qaHost + media.source_url.split(location.origin)[1];
                            }

                            item.image = imgPath;
                            break;
                        }
                    }
                }

                return item;
            });
        } catch (error) {
            // this.errorService.logError({code: '5.0.2', data: error});
            return Promise.reject(error);
        }
    }

    protected cleanText(text: string): string {
        return _replace(
            text,
            /&#([0-9]*);/,
            (match: string, p1: number) => String.fromCharCode(p1),
        );
    }

    protected async requestData<T>(params: IStaticRequestParams): Promise<HttpResponse<T>> {
        const url = this.getWPLink(params);
        const lang = params.lang || this.translateService.currentLang;

        const httpRequestParams = new HttpRequest('GET', url, {
            params: new HttpParams({
                fromObject: _merge({slug: params.slug, lang}, this.params),
            }),
        });

        return await this.httpClient.request(httpRequestParams).toPromise() as HttpResponse<T>;
    }

    protected getSlugPages(isPage: boolean): string[] {
        if (isPage) {
            return [];
        }
        return this.configService.appConfig.$static?.pagesOnly;
    }

    protected getWPLink(requestParams: IStaticRequestParams): string {
        const requestUrls: IRequestUrlStaticText = {
            category: '/content//wp-json/wp/v2/' + 'categories',
            tag: '/content//wp-json/wp/v2/' + 'tags',
            post: this.apiUrl + (this.useWpPlugin ? 'post' : 'posts'),
            page: this.apiUrl + (this.useWpPlugin ? 'page' : 'pages'),
        };

        return (this.sanitizer
            .bypassSecurityTrustUrl(requestUrls[requestParams.type]) as any)
            .changingThisBreaksApplicationSecurity;
    }

    protected async setConfig(): Promise<boolean> {
        try {
            this.useWpPlugin = await this.checkPlugin('wlc-api');
        } catch {
            this.useWpPlugin = false;
        }

        this.apiUrl = this.useWpPlugin ? '/content/wp-json/wp-wlc-api/v1/' : '/content//wp-json/wp/v2/';
        this.params = this.getParams();
        return true;
    }

    protected async checkPlugin(plugin?: string): Promise<boolean> {
        if (this.configService.appConfig.$static?.wpPlugins?.wlcApi === false) {
            return false;
        }

        const request = new HttpRequest('GET', '/content/wp-json/wp-wlc-api/v1/active-plugins/');
        return this.httpClient.request<HttpRequest<string>>(request).toPromise()
            .then((response: any) => {
                if (plugin) {
                    const rx = new RegExp(`^${plugin}\/`);
                    return !!_find(response.data, (item) => rx.test(item));
                }
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
            if (result?.data?.code) {
                return;
            }
            res = new WlcTextData({data: result.data}, this.configService);
        } else {
            if (!result?.[0]) {
                return;
            }
            res = new WpTextData(result[0], this.configService);
        }
        return res;
    }

    protected async getList(categories: number[], params: IParamsStaticText): Promise<IPostResponse[]> {
        const categoryIds: string = _join(categories, ',');
        try {
            return await this.getPosts(_extend(params || {}, {categories: categoryIds}));
        } catch (error) {
            // this.errorService.logError({code: '5.0.6', data: error});
            return Promise.reject(error);
        }
    }

}

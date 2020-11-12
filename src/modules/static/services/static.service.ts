import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';

import {IIndexing} from 'wlc-engine/interfaces';
import {ConfigService} from 'wlc-engine/modules/core';
import {
    ICategoryStaticText,
    IStaticParams,
    IPostResponse,
    IRequestUrlStaticText,
    StaticTextType,
    TextDataModel,
    WlcTextData,
    WpTextData,
    TextDataType,
} from 'wlc-engine/modules/static';

import {
    filter as _filter,
    find as _find,
    includes as _includes,
    merge as _merge,
    union as _union,
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
        protected translateService: TranslateService,
        protected sanitizer: DomSanitizer,
        private httpClient: HttpClient,
    ) {
        this.configReady = this.setConfig();
    }

    public getPost(slug: string): Promise<TextDataModel> {
        return this.getStaticData('post',{slug});
    }

    public getPage(slug: string): Promise<TextDataModel> {
        // TODO: check it
        return this.getStaticData('page',{slug});
    }

    public getTag(slug: string): Promise<TextDataModel> {
        // TODO: check it
        return this.getStaticData('tag',{slug});
    }

    public async getPostsListByCategorySlug(
        categorySlug: string | string[],
        params: IStaticParams = {},
        all = true,
    ): Promise<TextDataModel[]> {
        try {
            if (all && !_isArray(categorySlug)) {
                const categories: ICategoryStaticText[] = await this.getSubCategories(categorySlug);
                const parentCatId: number = await this.getCategoryIdBySlug(categorySlug);
                const catsId = _map(categories, (item) => +item.id);

                catsId.push(parentCatId);
                return await this.getPostList(catsId, params);
            } else if (_isArray(categorySlug)) {
                const currentCategoryId: number = await this.getCategoryIdBySlug(categorySlug);
                return await this.getPostList([+currentCategoryId], params);
            }
        } catch (error) {
            return error;
        }
    }

    public async getCategories(): Promise<ICategoryStaticText[]> {
        try {
            const response = await this.requestData<ICategoryStaticText[]>('category');
            return response?.body;
        } catch (e) {
            // this.errorService.logError({code: '5.0.3'});
        }
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

    protected async getStaticData(type: StaticTextType, params: IStaticParams): Promise<TextDataModel> {
        if (!params.slug) {
            return Promise.reject('Must be slug');
        }
        await this.configReady;

        try {
            const response = await this.requestData<IPostResponse>(type, params);
            // TODO: check if not exist in current lang and load in English

            const data: TextDataModel = this.prepareTextData(response.body);
            if (!data) {
                return Promise.reject('No content data');
            }

            return data;
        } catch (e) {
            // logService
        }
    }

    protected normalizeContent(item: IPostResponse): IPostResponse {
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
    }

    protected cleanText(text: string): string {
        return _replace(
            text,
            /&#([0-9]*);/,
            (match: string, p1: number) => String.fromCharCode(p1),
        );
    }

    protected async requestData<T>(type: StaticTextType, params: IStaticParams = {}): Promise<HttpResponse<T>> {
        const url = this.getWPLink(type);
        const lang = params.lang || this.translateService.currentLang;

        let httpParams = new HttpParams({
            fromObject: _merge({}, this.params, params, {
                slug: params.slug,
                lang,
            }),
        });

        if(!httpParams.get('slug')) {
            httpParams = httpParams.delete('slug');
        }

        const httpRequestParams = new HttpRequest('GET', url, {
            params: httpParams,
        });
        return await this.httpClient.request(httpRequestParams).toPromise() as HttpResponse<T>;
    }

    protected getSlugPages(isPage: boolean): string[] {
        if (isPage) {
            return [];
        }
        return this.configService.get<string[]>('$static.pagesOnly');
    }

    protected getWPLink(type: StaticTextType): string {
        const requestUrls: IRequestUrlStaticText = {
            category: '/content//wp-json/wp/v2/' + 'categories',
            tag: '/content//wp-json/wp/v2/' + 'tags',
            post: this.apiUrl + (this.useWpPlugin ? 'post' : 'posts'),
            page: this.apiUrl + (this.useWpPlugin ? 'page' : 'pages'),
        };

        return this.sanitizer
            .bypassSecurityTrustUrl(requestUrls[type])?.['changingThisBreaksApplicationSecurity'];
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
        if (this.configService.get<boolean>('$static.wpPlugins.wlcApi') === false) {
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

    protected getParams(): IIndexing<string> {
        const fields = this.configService.get<any>('$static.additionalFields');
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

    protected prepareTextData(response: TextDataType): TextDataModel {
        let res: TextDataModel;

        if (this.useWpPlugin) {
            if (response?.['data']?.code) {
                return;
            }
            res = new WlcTextData({data: this.normalizeContent(response?.['data'])}, this.configService);
        } else {
            if (!response?.[0]) {
                return;
            }
            res = new WpTextData(this.normalizeContent(response[0]), this.configService);
        }
        return res;
    }

    protected async getPostList(categories: number[], params: IStaticParams = {}): Promise<TextDataModel[]> {
        const categoryIds: string = _join(categories, ',');
        try {
            const response = await this.requestData<IPostResponse[]>( 'post', _extend(params, {
                categories: categoryIds,
            }));

            return _map(response.body, (item) => {
                item = this.normalizeContent(item);

                if (this.useWpPlugin) {
                    return new WlcTextData({data: item}, this.configService);
                } else {
                    return new WpTextData(item, this.configService);
                }
            });
        } catch (error) {
            // this.errorService.logError({code: '5.0.6', data: error});
            return Promise.reject(error);
        }
    }
}

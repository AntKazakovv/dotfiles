import {
    HttpClient,
    HttpParams,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import {
    Inject,
    Injectable,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer} from '@angular/platform-browser';

import _filter from 'lodash-es/filter';
import _union from 'lodash-es/union';
import _extend from 'lodash-es/extend';
import _merge from 'lodash-es/merge';
import _find from 'lodash-es/find';
import _map from 'lodash-es/map';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _replace from 'lodash-es/replace';
import _join from 'lodash-es/join';
import _isArray from 'lodash-es/isArray';
import _isNumber from 'lodash-es/isNumber';
import _forEach from 'lodash-es/forEach';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    ICategoryStaticText,
    IStaticParams,
    IPostResponse,
    IRequestUrlStaticText,
    StaticTextType,
    TWpTranslateMode,
    ISplitTexts,
    IPDFParams,
} from 'wlc-engine/modules/static/system/interfaces/static.interface';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {WlcTextData} from 'wlc-engine/modules/static/system/models/textdata.wlc.model';
import {WpTextData} from 'wlc-engine/modules/static/system/models/textdata.wp.model';
import {
    WpPluginsType,
    ICacheExpiry,
} from 'wlc-engine/modules/static/system/interfaces/static.interface';
import {HooksService} from 'wlc-engine/modules/core';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';

@Injectable({
    providedIn: 'root',
})
export class StaticService {
    private cacheExpiryParam: ICacheExpiry;
    private useWpPlugin: boolean;
    private categories: ICategoryStaticText[] = [];
    private params: IIndexing<string>;
    private fieldsList: string[] = [
        'id',
        'date',
        'slug',
        'title',
        'content',
        'image',
    ];
    private $resolve: () => void;
    private ready: Promise<boolean> = new Promise((resolve: (v?: boolean) => void): void => {
        this.$resolve = resolve;
    });
    private slugPrepareHookName = 'staticSlugPrepare';

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private httpClient: HttpClient,
        private cachingService: CachingService,
        private hooksService: HooksService,
        @Inject(CuracaoRequirement) private enableRequirement: boolean,
    ) {
        this.init();
    }

    public async getPost(slug: string): Promise<TextDataModel> {
        slug = await this.hooksService.run(this.slugPrepareHookName, slug);
        return this.getStaticData('post', {slug});
    }

    public async getPage(slug: string): Promise<TextDataModel> {
        slug = await this.hooksService.run(this.slugPrepareHookName, slug);
        return this.getStaticData('page', {slug});
    }

    public getTag(slug: string): Promise<TextDataModel> {
        return this.getStaticData('tag', {slug});
    }

    public async getPostsListByCategorySlug(
        categorySlug: string | string[],
        params: IStaticParams = {},
        all = true,
    ): Promise<TextDataModel[]> {
        await this.ready;
        if (all && !_isArray(categorySlug)) {
            const categories: ICategoryStaticText[] = this.getSubCategories(categorySlug);
            const parentCatId: number = this.getCategoryIdBySlug(categorySlug);
            const catsId = _map(categories, (item) => +item.id);
            catsId.push(parentCatId);

            return await this.getPostList(catsId, params);
        } else if (_isArray(categorySlug)) {
            const currentCategoryId: number = this.getCategoryIdBySlug(categorySlug);

            return await this.getPostList([+currentCategoryId], params);
        }
    }

    /**
     * Returns a link to the PDF file
     * @param {string} slug - the slug of the page you want to convert to PDF
     * @returns {string} - url
     */
    public getLinkToPdf(slug: string): string {
        const params: IPDFParams = {
            slug,
            wpPlugin: this.useWpPlugin ? 1 : 0,
            prepath: this.configService.get<TWpTranslateMode>('$static.wpPlugins.translateMode') === 'pre-path' ? 1 : 0,
            page: 'pages',
        };

        if (this.configService.get<string[]>({name: '$static.pages'}).includes(slug)) {
            const splitSettings = this.configService.get<ISplitTexts>({name: '$static.splitStaticTexts'});
            if (splitSettings?.useByDefault || _get(splitSettings, 'slugs', []).includes(slug)) {
                params.lang = this.translateService.currentLang;
            }
            params.page = 'pages';
        }

        const queryParams = Object.entries(params).reduce((res, [key, value]) => {
            res.push(`${key}=${value}`);
            return res;
        }, []).join('&');

        return '/api/v1/wptopdf?' + queryParams;
    }

    private cacheExpiry(type): number {
        return this.cacheExpiryParam[type];
    }

    private async init(): Promise<void> {
        await this.configService.ready;
        await this.setConfig();
        await this.getCategories();
        this.ready = Promise.resolve(true);
    }

    private getCategoryIdBySlug(slug: string | string[]): number {
        if (!_isArray(slug)) {
            return _find(this.categories, (res) => res.slug === slug)?.id;
        }

        const parentId: number = _find(this.categories, (res) => res.slug === slug[0])?.id;

        if (slug[0] === slug[1]) {
            return parentId;
        }

        if (parentId) {
            return _find(this.categories, (res) => res.slug === slug[1] && res.parent === parentId)?.id;
        }
    }

    private async getCategories(): Promise<void> {
        const httpRequestUrl = this.getHttpRequestParams<IPostResponse>('category')?.urlWithParams;
        const cacheExpiry = this.cacheExpiry('category');

        if (cacheExpiry) {
            const categories = (await this.cachingService.get<ICategoryStaticText[]>(httpRequestUrl)) || [];
            if (categories.length) {
                this.categories = categories;
                return this.$resolve();
            }
        }

        const response = await this.requestData<ICategoryStaticText[]>('category');
        this.categories = response?.body || [];
        this.$resolve();

        if (cacheExpiry) {
            await this.cachingService.set<ICategoryStaticText>(
                httpRequestUrl,
                response?.body,
                false,
                cacheExpiry,
            );
        }
    }

    private getSubCategories(slug: string | string[]): ICategoryStaticText[] {
        const subCategories: ICategoryStaticText[] = [];
        const parentId = this.getCategoryIdBySlug(slug);

        if (!_isNumber(parentId)) {
            return;
        }

        _forEach(this.categories, (item: ICategoryStaticText) => {
            const id = item.slug === 'news' ? item.id : item.parent;

            if (id === parentId) {
                subCategories.push(item);
            }
        });

        return subCategories;
    }

    private async getStaticData(type: StaticTextType, params: IStaticParams): Promise<TextDataModel> {
        const httpRequestUrl = this.getHttpRequestParams<IPostResponse>(type, params)?.urlWithParams;
        await this.ready;
        const cacheExpiry = this.cacheExpiry(type);

        if (cacheExpiry) {
            const posts: IPostResponse[] = (await this.cachingService.get<IPostResponse[]>(httpRequestUrl)) || [];
            if (posts.length) {
                return this.switchTextData(posts[0]);
            }
        }

        const response: HttpResponse<IPostResponse[]> = await this.requestData<IPostResponse[]>(type, params);

        if (cacheExpiry) {
            this.cachingService.set<IPostResponse>(httpRequestUrl, response.body, false, cacheExpiry);
        }

        return this.switchTextData(response.body);
    }

    private normalizeContent(item: IPostResponse): IPostResponse {
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

    private cleanText(text: string): string {
        return _replace(
            text,
            /&#(\d*);/,
            (match: string, p1: number) => String.fromCharCode(p1),
        );
    }

    private async requestData<T>(type: StaticTextType, params: IStaticParams = {}): Promise<HttpResponse<T>> {
        const httpRequestParams = this.getHttpRequestParams<T>(type, params);
        try {
            return await this.httpClient.request(httpRequestParams).toPromise() as HttpResponse<T>;
        } catch (e) {
            console.error(e);
        }
    }

    private getSlugPages(isPage: boolean): string[] {
        if (isPage) {
            return [];
        }
        return this.configService.get<string[]>('$static.pagesOnly');
    }

    private getWpApiUrl(type: StaticTextType, lang: string): string {
        const mode = this.configService.get<TWpTranslateMode>('$static.wpPlugins.translateMode');

        const apiUrl = this.useWpPlugin
            ? '/content/wp-json/wp-wlc-api/v1/'
            : `/content/${(mode === 'query') ? '' : lang}/wp-json/wp/v2/`;

        const requestUrls: IRequestUrlStaticText = {
            category: '/content//wp-json/wp/v2/categories',
            tag: '/content//wp-json/wp/v2/tags',
            post: apiUrl + (this.useWpPlugin ? 'post' : 'posts?per_page=100'),
            page: apiUrl + (this.useWpPlugin ? 'page' : 'pages'),
        };

        return this.sanitizer
            .bypassSecurityTrustUrl(requestUrls[type])?.['changingThisBreaksApplicationSecurity'];
    }

    private getHttpRequestParams<T>(type: StaticTextType, params: IStaticParams = {}): HttpRequest<T> {
        const lang = this.getLanguageCode(params.lang || this.translateService.currentLang);
        const url = this.getWpApiUrl(type, lang);

        let httpParams = new HttpParams({
            fromObject: _merge({}, this.params, params, {
                slug: params.slug,
                lang,
            }),
        });

        if (!httpParams.get('slug')) {
            httpParams = httpParams.delete('slug');
        }
        return new HttpRequest('GET', url, {
            params: httpParams,
        });
    }

    private async setConfig(): Promise<boolean> {
        this.cacheExpiryParam = this.configService.get<ICacheExpiry>('$static.cacheExpiry');
        this.useWpPlugin = await this.checkPlugin();
        this.params = this.getParams();
        return true;
    }

    private async checkPlugin(plugin: WpPluginsType = 'wlc-api'): Promise<boolean> {
        if (this.configService.get<boolean>('$static.wpPlugins.wlcApi') === false) {
            return false;
        }

        const cacheExpiry = this.cacheExpiry('plugin');
        const rx = new RegExp(`^${plugin}\/`);
        const requestUrl = '/content/wp-json/wp-wlc-api/v1/active-plugins/';
        let plugins: string[];

        if (cacheExpiry) {
            plugins = (await this.cachingService.get<string[]>(requestUrl)) || [];
        }

        try {
            if (!plugins.length) {
                plugins = await this.httpClient
                    .request<string[]>('GET', requestUrl)
                    .toPromise();
                if (cacheExpiry) {
                    this.cachingService.set<string>(requestUrl, plugins, false, cacheExpiry);
                }
            }

            return !!_find(plugins, (item) => rx.test(item));
        } catch (e) {
            return false;
        }
    }

    private getParams(): IIndexing<string> {
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

    private switchTextData(responsePost: IPostResponse | IPostResponse[]): TextDataModel {
        responsePost = _isArray(responsePost) ? responsePost[0] : responsePost;

        return this.useWpPlugin
            ? new WlcTextData(
                {
                    service: 'StaticService',
                    method: 'switchTextData',
                    model: 'WlcTextData',
                },
                this.normalizeContent(responsePost),
                this.configService)
            : new WpTextData(
                {
                    service: 'StaticService',
                    method: 'switchTextData',
                    model: 'WpTextData',
                },
                this.normalizeContent(responsePost),
                this.configService);
    }

    private async getPostList(categories: number[], params: IStaticParams = {}): Promise<TextDataModel[]> {
        const extParams = _extend(params, {
            categories: _join(categories, ','),
        });
        const cacheExpiry = this.cacheExpiry('post');
        const httpRequestUrl = this.getHttpRequestParams<IPostResponse[]>('post', extParams)?.urlWithParams;

        const cachedPosts: IPostResponse[] = cacheExpiry
            ? (await this.cachingService.get<IPostResponse[]>(httpRequestUrl))
            : [];

        let posts: IPostResponse[];

        if (cachedPosts?.length) {
            posts = cachedPosts;
        } else {
            posts = (await this.requestData<IPostResponse[]>('post', extParams))?.body;
            if (cacheExpiry) {
                this.cachingService.set<IPostResponse>(httpRequestUrl, posts, false, cacheExpiry);
            }
        }

        return _map(posts, (item) => {
            return new WpTextData(
                {
                    service: 'StaticService',
                    method: 'getPostList',
                    model: 'WpTextData',
                },
                this.normalizeContent(item),
                this.configService);
        });
    }

    /**
     * Method allows to request data from wordpress with custom language code.
     * Some of fundist's languages have code like 'pt-br' which doesn't support by wordpress,
     * so you can change it for 'pt' code via $static config.
     */
    private getLanguageCode(lang: string): string {
        return this.configService.get<string>(`$static.rewritingLanguages[${lang}]`) || lang.split('-').shift();
    }

    // Just for future
    // this.hooksService.set(this.slugPrepareHookName, this.termsSlugChange, this);
    // private async termsSlugChange(slug: string): Promise<string> {
    //     if (slug === 'terms-and-conditions') {
    //         const userInfo$ = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'});
    //         const userInfo = userInfo$.value ?? await firstValueFrom(userInfo$.pipe(first((v) => !!v)));

    //         if (userInfo.nextTermsVersion <= DateTime.now()) {
    //             return `${slug}_${userInfo.nextTermsVersion.toFormat('yyyy-LL-dd')}`;
    //         }
    //         return `${slug}_${DateTime.now().toFormat('yyyy-LL-dd')}`;
    //     }

    //     return slug;
    // }
}

import {
    Inject,
    Injectable,
} from '@angular/core';
import {
    Meta,
    Title,
} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {
    StateParams,
    StateService,
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';

import _isString from 'lodash-es/isString';
import _find from 'lodash-es/find';
import _forOwn from 'lodash-es/forOwn';
import _mapValues from 'lodash-es/mapValues';

import {
    GamesHelper,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {
    IIndexing,
    IData,
    DataService,
    ConfigService,
    CachingService,
    InjectionService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    IGameStateData,
    IStateData,
    IPageStateData,
    IStateDataWithChild,
} from 'wlc-engine/modules/seo/system/interfaces/seo.interfaces';

type TMetaTagsKey = keyof IStateData;
type TMetaTagsValues = Record<TMetaTagsKey, string>;
type TMetaTagsMap = Record<TMetaTagsKey, string[]>;

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    private useService: boolean;
    private useAlternativeLanguages: boolean = false;
    private useForPages: boolean = true;
    private useForGames: boolean = true;

    private pageStates: IPageStateData = {};
    private gameStates: IGameStateData[] = [];

    private metaTagsMap: TMetaTagsMap = {
        opengraph_title: ['title', 'og:title'],
        opengraph_desc: ['description', 'og:description'],
        opengraph_keywords: ['keywords', 'og:keywords'],
        opengraph_image: ['og:image'],
    };
    private opengraphRegexp: RegExp = /^og:/i;

    private siteName: string = '';
    private gamesCatalogService: GamesCatalogService;
    private rewritingLanguages: IIndexing<string>;

    constructor(
        @Inject(WINDOW) private window: Window,
        @Inject(DOCUMENT) private document: Document,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouterGlobals,
        private transition: TransitionService,
        private meta: Meta,
        private titleService: Title,
        private cachingService: CachingService,
        private dataService: DataService,
        private injectionService: InjectionService,
        private eventService: EventService,
        private logService: LogService,
        configService: ConfigService,
    ) {
        this.useService = Boolean(configService.get<boolean>('$base.seo.use'));
        if (!this.useService) {
            return;
        }

        this.useAlternativeLanguages = Boolean(configService.get<boolean>('$base.seo.useAlternativeLanguages'));
        this.siteName = configService.get('$base.site.name');
        this.rewritingLanguages = configService.get('$base.rewritingWpLanguages');
        this.init();
    }

    public get use(): boolean {
        return this.useService && (this.useForPages || this.useForGames);
    }

    /**
     * Updates from seo data the title tag only. Without other meta tags.
     */
    public setTitle(): void {
        if (!this.use) {
            return;
        }

        this.updateSeo(true);
    }

    protected async init(): Promise<void> {
        this.initMetaTags();

        if (this.useAlternativeLanguages) {
            this.addAlternativeLanguagesLinks();
        }

        await Promise.all([
            this.getPagesSeoData(),
            this.getGamesSeoData(),
        ]).then((value) => {
            [this.pageStates, this.gameStates] = value;
        });

        this.updateSeo();

        this.transition.onSuccess({}, () => {
            this.updateSeo();
        });

        this.eventService.subscribe({name: 'BETRADAR_URL_CHANGE'}, ({name, url}) => {
            this.setPageMetaTags(false, name, url);
        });
    }

    /**
     * Requests, caches and returns seo data for non-game pages from wordpress plugin 'Seo Softgamings'.
     *
     * @returns seo data for non-game pages.
     */
    protected async getPagesSeoData(): Promise<IPageStateData> {
        const cache: IPageStateData = await this.cachingService.get('seo-pages');
        if (cache) {
            return cache;
        }

        let result: IPageStateData = {};

        try {
            result = await this.dataService.request<IData<string | IPageStateData>>({
                name: 'seo',
                system: 'seo-pages',
                type: 'GET',
                fullUrl: '/content//wp-json/seo-plugin/v1/seo-data',
                params: {
                    lang: this.getLanguageCode(),
                },
            }).then((data: IData<string | IPageStateData>) => {
                if (typeof (data) !== 'object') {
                    return {};
                }
                // for backward compatibility
                if (_isString(data.data)) {
                    return JSON.parse(data.data) ?? {};
                }
                return data.data ?? {};
            });

            await this.cachingService.set<IPageStateData>('seo-pages', result);
        } catch (err: any) {
            this.useForPages = false;
            this.logService.sendLog({
                code: '7.0.2',  // Error - incorrect data format
                data: err,
                from: {
                    service: 'SeoService',
                    method: 'getPagesSeoData',
                },
            });
        }

        return result;
    }

    /**
     * Requests, caches and returns seo data for game pages from wordpress plugin 'Seo Softgamings'
     *
     * @returns seo data for game pages.
     */
    protected async getGamesSeoData(): Promise<IGameStateData[]> {
        const cache: IGameStateData[] = await this.cachingService.get('seo-games');
        if (cache) {
            return cache;
        }

        let result: IGameStateData[] = [];

        try {
            result = await this.dataService.request<string | IGameStateData[]>({
                name: 'seo',
                system: 'seo-games',
                type: 'GET',
                fullUrl: '/content//wp-json/seo-plugin/v1/seo-data-games',
                params: {
                    lang: this.getLanguageCode(),
                },
            }).then((data: IData<string | IGameStateData[]>): IGameStateData[] => {
                if (typeof (data) !== 'object') {
                    return [];
                }
                // for backward compatibility
                if (_isString(data.data)) {
                    const resultData: unknown = JSON.parse(data.data);
                    return (Array.isArray(resultData)) ? resultData : [];
                }
                return (Array.isArray(data.data)) ? data.data : [];
            });

            await this.cachingService.set<IGameStateData>('seo-games', result);
        } catch (err: any) {
            this.useForGames = false;
            this.logService.sendLog({
                code: '7.0.2',  // Error - incorrect data format
                data: err,
                from: {
                    service: 'SeoService',
                    method: 'getGamesSeoData',
                },
            });
        }

        return result;
    }

    /**
     * Update seo for page or game
     * @param {boolean} [titleOnly=false] Update only Title tag (w/o meta tags)
     */
    protected updateSeo(titleOnly: boolean = false): void {
        if (this.useAlternativeLanguages) {
            this.addAlternativeLanguagesLinks();
        }

        if (this.router.current.name === 'app.gameplay') {
            this.setGameMetaTag(titleOnly);
        } else {
            this.setPageMetaTags(titleOnly);
        }
    }

    protected setPageMetaTags(titleOnly: boolean, state?: string, url?: string): void {
        const currentState = state || this.router.current.name;
        const currentSeoState: string = currentState === 'app.catalog.child' ? 'app.catalog' : currentState;
        let stateSeo: IStateDataWithChild = this.pageStates?.[currentSeoState] || this.pageStates?.['app.home'];

        if (!stateSeo) {
            return;
        }

        if (stateSeo.childred?.length) {
            const currentUrl = url || this.stateService.href(this.router.current);
            const nested = _find(stateSeo.childred, (item) => currentUrl.endsWith('/' + item.page));
            if (nested) {
                stateSeo = nested.data;
            }
        }

        const metaValues: TMetaTagsValues = this.getMetaValues(stateSeo);
        this.updateMetaTags(metaValues, titleOnly);
    }

    /**
     * Method uses only on app.gameplay state and takes information for SeoGames request;
     */
    protected async setGameMetaTag(titleOnly: boolean): Promise<void> {
        const params: StateParams = this.router.params;
        const gameSeo: IGameStateData = _find(this.gameStates, (el: IGameStateData): boolean => {
            return (el.merchantID === params.merchantId) && (el.launchCode === params.launchCode);
        });

        if (!gameSeo) {

            if (this.pageStates['app.gameplay']) {
                this.setPageMetaTags(false, 'app.gameplay');
            }

            return;
        }

        this.gamesCatalogService ??= await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        const merchantId: number = Number(gameSeo.merchantID);
        const merchantName: string = GamesHelper.getMerchantAliasById(merchantId);
        const game: Game = this.gamesCatalogService.getGame(merchantId, gameSeo.launchCode);
        if (!game) {
            return;
        }

        const metaValues: TMetaTagsValues = this.getGameMetaValues(gameSeo, merchantName, game);
        this.updateMetaTags(metaValues, titleOnly);
    }

    protected initMetaTags(): void {
        _forOwn(this.metaTagsMap, (metaValues: string[]) => {
            this.meta.addTags(
                metaValues.map((meta: string) =>
                    this.opengraphRegexp.test(meta) ? {property: meta, content: ''} : {name: meta, content: ''},
                ),
            );
        });
    }

    protected updateMetaTags(metaValues: TMetaTagsValues, titleOnly: boolean): void {
        this.titleService.setTitle(metaValues.opengraph_title);
        if (titleOnly) {
            return;
        }

        _forOwn(this.metaTagsMap, (values: string[], key: TMetaTagsKey) => {
            values.forEach((meta: string) => {
                this.meta.updateTag({
                    [this.opengraphRegexp.test(meta) ? 'property' : 'name']: meta,
                    content: metaValues[key] || '',
                });
            });
        });
    }

    protected addAlternativeLanguagesLinks(): void {
        const currentLang: string = this.getLanguageCode();
        const currentLinks: NodeList = this.document.querySelectorAll('link[hreflang][rel="alternate"]');
        currentLinks.forEach((link: Node) => this.document.head.removeChild(link));

        this.translateService.langs
            .filter(lang => lang !== currentLang)
            .forEach(lang => this.createAlternateLanguageLink(lang));
    }

    private createAlternateLanguageLink(lang: string): void {
        const link: HTMLLinkElement = this.document.createElement('link');
        link.rel = 'alternate';
        link.href = this.generateAlternateLinkUrl(lang);
        link.hreflang = lang;
        this.document.head.appendChild(link);
    }

    private generateAlternateLinkUrl(lang: string): string {
        const urlParts: string[] = this.window.location.href.split('/');
        urlParts[3] = lang;
        return urlParts.join('/');
    }

    private getMetaValues(stateData: IStateData): TMetaTagsValues {
        const currentLang: string = this.getLanguageCode();
        const result = {} as TMetaTagsValues;

        _forOwn(this.metaTagsMap, (values: string[], key: TMetaTagsKey) => {
            result[key] = stateData[key]?.[currentLang] || stateData[key]?.['en'] || '';
        });

        result.opengraph_title ||= this.siteName;
        return result;
    }

    private getGameMetaValues(gameStateData: IGameStateData, merchant: string, game: Game): TMetaTagsValues {
        const currentLang: string = this.getLanguageCode();
        const result: TMetaTagsValues = this.getMetaValues(gameStateData);

        return _mapValues(result, (value: string) => {
            return value.replace('[merchant]', merchant)
                .replace('[game]', game.name[currentLang] || game.name['en']);
        });
    }

    private getLanguageCode(): string {
        const lang = this.translateService.currentLang || 'en';
        return this.rewritingLanguages[lang] || lang.split('-').shift();
    }
}

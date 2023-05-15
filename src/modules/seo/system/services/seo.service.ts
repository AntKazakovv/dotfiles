import {
    Injectable,
} from '@angular/core';
import {
    Meta,
    Title,
} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';

import {EventService} from 'wlc-engine/modules/core';

import _get from 'lodash-es/get';
import _isString from 'lodash-es/isString';
import _find from 'lodash-es/find';
import _isEmpty from 'lodash-es/isEmpty';

import {
    GamesHelper,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {
    IIndexing,
    DataService,
    IData,
    ConfigService,
    CachingService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    IGameStateData,
    IStateData,
    IStateDataWithChild,
} from 'wlc-engine/modules/seo/system/interfaces/seo.interfaces';

type MetaTagKey = string;

type OpenGraphKey = string;

type MetaTagInfo = [MetaTagKey, OpenGraphKey];

@Injectable({
    providedIn: 'root',
})
export class SeoService {
    public seo: IIndexing<IStateDataWithChild> = {};
    public seoGames: IGameStateData[] = [];

    protected metaTags: MetaTagInfo[] = [
        ['title', 'opengraph_title'],
        ['og:title', 'opengraph_title'],
        ['og:image', 'opengraph_image'],
        ['keywords', 'opengraph_keywords'],
        ['og:keywords', 'opengraph_keywords'],
        ['description', 'opengraph_desc'],
    ];

    private siteName: string = '';
    private gamesCatalogService: GamesCatalogService;
    private rewritingLanguages: IIndexing<string>;

    constructor(
        private configService: ConfigService,
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
    ) {
        this.init();
    }

    /**
     * set title by seo
     */
    public setTitle(): void {
        this.seoHandler(true);
    }

    protected async init(): Promise<void> {
        this.rewritingLanguages = this.configService.get<IIndexing<string>>('$base.rewritingWpLanguages');
        await this.getSeoData();
        this.siteName = this.configService.get<string>('$base.site.name');
        this.meta.addTags(this.metaTags.map(([name]) => ({
            name,
            content: '',
        })));

        this.seoHandler();

        this.transition.onSuccess({}, () => {
            this.seoHandler();
        });

        this.eventService.subscribe({name: 'BETRADAR_URL_CHANGE'}, ({name, url}) => {
            this.setMetaTags(false, name, url);
        });
    }

    /**
     * Gets seo data from wordpress plugin 'Seo Softgamings'.
     * Two different requests for usual seo data and for gameplay state.
     */
    protected async getSeoData(): Promise<void> {
        try {
            if (!await this.cachingService.get('seo-pages')) {
                await this.dataService.request<IData<string | IIndexing<IStateDataWithChild>>>(
                    {
                        name: 'seo',
                        system: 'seo-pages',
                        type: 'GET',
                        fullUrl: '/content//wp-json/seo-plugin/v1/seo-data',
                        params: {
                            lang: this.getLanguageCode(),
                        },
                    },
                ).then((data: IData<string | IIndexing<IStateDataWithChild>>) => {
                    // for backward compatibility
                    if (_isString(data.data)) {
                        this.seo = JSON.parse(data.data);
                    } else {
                        this.seo = data.data;
                    }
                });
                await this.cachingService.set<IIndexing<IStateDataWithChild>>('seo-pages', this.seo);
            } else {
                this.seo = await this.cachingService.get('seo-pages');
            }

            if (!await this.cachingService.get('seo-games')) {
                await this.dataService.request<IData<string | IGameStateData[]>>(
                    {
                        name: 'seo',
                        system: 'seo-pages',
                        type: 'GET',
                        fullUrl: '/content//wp-json/seo-plugin/v1/seo-data-games',
                        params: {
                            lang: this.getLanguageCode(),
                        },
                    },
                ).then((data) => {
                    // for backward compatibility
                    if (_isString(data.data)) {
                        this.seoGames = JSON.parse(data.data);
                    } else {
                        this.seoGames = data.data;
                    }
                });
                await this.cachingService.set('seo-games', this.seoGames);
            } else {
                this.seoGames = await this.cachingService.get('seo-games');
            }
        } catch (e) {
            //
        }
    }

    protected setMetaTags(onlyTitle?: boolean, state?: string, url?: string): void {
        if (_isEmpty(this.seo)) {
            return;
        }

        const currentState = state || this.router.current.name;
        const currentLang = this.getLanguageCode();
        let seoState = this.seo[currentState === 'app.catalog.child' ? 'app.catalog' : currentState]
            || this.seo['app.home'];

        if (_isEmpty(seoState)) {
            return;
        }

        if (seoState?.childred?.length) {
            const currentUrl = url || this.stateService.href(this.router.current);
            const nested = _find(seoState.childred, (item) => currentUrl.endsWith('/' + item.page));
            if (nested) {
                seoState = nested.data;
            }
        }

        this.titleService.setTitle(
            _get(seoState,
                `opengraph_title.${currentLang}`, this.siteName),
        );

        if (onlyTitle) {
            return;
        }

        this.updateMetaTags(seoState, currentLang);
    }

    /**
     * Method uses only on app.gameplay state and takes information for SeoGames request;
     */
    protected async setGamesMetaTag(onlyTitle?: boolean): Promise<void> {
        if (this.router.current.name === 'app.gameplay') {
            if (!this.seoGames?.length) {
                return;
            }
            this.gamesCatalogService = await this.injectionService
                .getService<GamesCatalogService>('games.games-catalog-service');
            const currentLang = this.getLanguageCode();
            const params = this.router.params;
            const gameSeo = this.seoGames.find((el) => {
                return el['merchantID'] === params.merchantId &&
                    el['launchCode'] === params.launchCode;
            });
            if (!gameSeo) {
                return;
            }
            const merchantName = GamesHelper.getMerchantAliasById(+gameSeo['merchantID']);
            const game = this.gamesCatalogService.getGame(+gameSeo['merchantID'], gameSeo['launchCode']);

            for (const key in gameSeo) {
                if (gameSeo[key][currentLang]) {
                    gameSeo[key][currentLang] = gameSeo[key][currentLang]
                        .replace('[merchant]', merchantName)
                        .replace('[game]', game.name[currentLang] || game.name['en']);
                }
            }

            this.titleService.setTitle(_get(gameSeo, `opengraph_title.${currentLang}`, this.siteName));
            if (onlyTitle) {
                return;
            }

            this.updateMetaTags(gameSeo, currentLang);
        }
    }

    protected seoHandler(onlyTitle?: boolean): void {
        if (this.router.current.name === 'app.gameplay') {
            this.setGamesMetaTag(onlyTitle);
        } else {
            this.setMetaTags(onlyTitle);
        }
    }

    protected updateMetaTags(state: IStateData, currentLang: string): void {
        for (const [name, key] of this.metaTags) {
            if (state[key]) {
                this.meta.updateTag({
                    name,
                    content: state[key][currentLang] || state[key]['en'] || '',
                });
            }
        }
    }

    private getLanguageCode(): string {
        const lang = this.translateService.currentLang || 'en';
        return this.rewritingLanguages[lang] || lang.split('-').shift();
    }
}

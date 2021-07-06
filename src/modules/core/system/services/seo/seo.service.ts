'use strict';

import {Injectable, Injector} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {CachingService} from 'wlc-engine/modules/core/system/services/caching/caching.service';

import _get from 'lodash-es/get';

@Injectable()
export class SeoService {
    public seo: IIndexing<any> = {};
    public seoGames: IIndexing<any>[] = [];
    protected siteName: string = '';
    protected GamesCatalogService: GamesCatalogService;

    constructor(
        private configService: ConfigService,
        private translateService: TranslateService,
        private stateService: StateService,
        private router: UIRouterGlobals,
        private transition: TransitionService,
        private meta: Meta,
        private titleService: Title,
        private translate: TranslateService,
        private cachingService: CachingService,
        private injector: Injector,
        private dataService: DataService,
    ) {
        if (this.configService.get<boolean>('$base.useSeo')) {
            this.init();
        }
    }

    protected async init(): Promise<void> {
        await this.getSeoData();
        this.siteName = this.configService.get<string>('$base.site.name');
        this.meta.addTags([
            {
                name: 'title',
                content: '',
            },
            {
                property: 'og:title',
                content: '',
            },
            {
                name: 'description',
                content: '',
            },
            {
                property: 'og:description',
                content: '',
            },
            {
                property: 'og:image',
                content: '',
            },
            {
                property: 'og:keywords',
                content: '',
            },
        ]);
        this.seoHandler();

        this.transition.onSuccess({}, () => {
            this.seoHandler();
        });
    }

    /**
     * Gets seo data from wordpress plugin 'Seo Softgamings'. Two different requests for usual seo data and for gameplay state.
     */
    protected async getSeoData(): Promise<void> {
        try {
            if (!await this.cachingService.get('seo-pages')) {
                await this.dataService.request(
                    {
                        name: 'seo',
                        system: 'seo-pages',
                        type: 'GET',
                        fullUrl: '/content//wp-json/seo-plugin/v1/seo-data',
                        cache: 100000,
                    },
                ).then((data: IIndexing<string>) => {
                    this.seo = JSON.parse(data.data);
                });
                await this.cachingService.set('seo-pages', this.seo);
            } else {
                this.seo = await this.cachingService.get('seo-pages');
            }

            if (!await this.cachingService.get('seo-games')) {
                await this.dataService.request(
                    {
                        name: 'seo',
                        system: 'seo-pages',
                        type: 'GET',
                        fullUrl: '/content//wp-json/seo-plugin/v1/seo-data-games',
                        cache: 100000,
                    },
                ).then((data: IIndexing<string>) => {
                    this.seoGames = JSON.parse(data.data);
                });
                await this.cachingService.set('seo-games', this.seoGames);
            } else {
                this.seoGames = await this.cachingService.get('seo-games');
            }
        } catch (e) {
            //
        }
    }

    protected setMetaTags(): void {
        if (!this.seo) {
            return;
        }

        const currentLang = this.translate.currentLang;
        const seoState = this.seo[this.router.$current.name];

        this.titleService.setTitle(
            _get(seoState,
                `opengraph_title.${currentLang}`, this.siteName),
        );
        this.meta.updateTag({
            name: 'title',
            content: _get(seoState, `opengraph_title.${currentLang}`, this.siteName),
        });
        this.meta.updateTag({
            property: 'og:title',
            content: _get(seoState, `opengraph_title.${currentLang}`, this.siteName),
        });
        this.meta.updateTag({
            name: 'description',
            content: _get(seoState, `opengraph_desc.${currentLang}`, ''),
        });
        this.meta.updateTag({
            property: 'og:description',
            content: _get(seoState, `opengraph_desc.${currentLang}`, ''),
        });
        this.meta.updateTag({
            property: 'og:image',
            content: _get(seoState, `opengraph_image.${currentLang}`, ''),
        });
        this.meta.updateTag({
            property: 'og:keywords',
            content: _get(seoState, `opengraph_keywords.${currentLang}`, ''),
        });
    }

    /**
     * Method uses only on app.gameplay state and takes information for SeoGames request;
     */
    protected setGamesMetaTag(): void {
        if (this.router.current.name === 'app.gameplay') {
            if (!this.seoGames) {
                return;
            }
            this.GamesCatalogService = this.injector.get(GamesCatalogService);
            const currentLang = this.translate.currentLang;
            const params = this.router.params;
            const gameSeo = this.seoGames.find(el => {
                return el['merchantID'] === params.merchantId &&
                    el['launchCode'] === params.launchCode;
            });
            if (!gameSeo) {
                return;
            }
            const merchantName = GamesHelper.getMerchantAliasById(+gameSeo['merchantID']);
            const game = this.GamesCatalogService.getGame(+gameSeo['merchantID'], gameSeo['launchCode']);

            for (const key in gameSeo) {
                if (gameSeo[key][currentLang]) {
                    gameSeo[key][currentLang] = gameSeo[key][currentLang]
                        .replace('[merchant]', merchantName)
                        .replace('[game]', game.name[currentLang] || game.name['en']);
                }
            }

            this.titleService.setTitle(_get(gameSeo, `opengraph_title.${currentLang}`, this.siteName));
            this.meta.updateTag({
                name: 'title',
                content: _get(gameSeo, `opengraph_title.${currentLang}`, this.siteName),
            });
            this.meta.updateTag({
                property: 'og:title',
                content: _get(gameSeo, `opengraph_title.${currentLang}`, this.siteName),
            });
            this.meta.updateTag({
                name: 'description',
                content: _get(gameSeo, `opengraph_desc.${currentLang}`, ''),
            });
            this.meta.updateTag({
                property: 'og:description',
                content: _get(gameSeo, `opengraph_desc.${currentLang}`, ''),
            });
            this.meta.updateTag({
                property: 'og:image',
                content: _get(gameSeo, `opengraph_image.${currentLang}`, ''),
            });
            this.meta.updateTag({
                property: 'og:keywords',
                content: _get(gameSeo, `opengraph_keywords.${currentLang}`, ''),
            });
        }
    }

    protected seoHandler(): void {
        if (this.router.$current.name === 'app.gameplay') {
            this.setGamesMetaTag();
        } else {
            this.setMetaTags();
        }
    }
}

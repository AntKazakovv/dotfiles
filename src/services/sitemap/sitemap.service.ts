import {
    inject,
    Injectable,
} from '@angular/core';

import {StateDeclaration} from '@uirouter/core';

import {
    ConfigService,
    ILanguage,
    InjectionService,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {RouterService} from 'wlc-engine/modules/core/system/services/router/router.service';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';
import {CategoryModel, GamesCatalogService} from 'wlc-engine/modules/games';
import {ISitemapConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/sitemap-config.interface';
import {ISitemapService} from 'wlc-engine/services/sitemap/sitemap.interface';

const CATEGORY_SLUG: string = 'legal' as const;

/**
 * Sitemap service for generating and downloading sitemap.xml files.
 */
@Injectable({
    providedIn: 'root',
})
export class SitemapService implements ISitemapService {

    // List of paths to include in the sitemap.
    private languages: string[] = [];
    // List of paths to include in the sitemap.
    private paths: string[] = [];
    // Sitemap configuration.
    private config: ISitemapConfig | null = null;

    private staticService: StaticService;
    private gamesCatalogService: GamesCatalogService;

    private readonly window: Window = inject<Window>(WINDOW);
    private readonly routerService: RouterService = inject(RouterService);
    private readonly configService: ConfigService = inject(ConfigService);
    private readonly injectionService: InjectionService = inject(InjectionService);

    /**
     * Downloads the sitemap.xml if the autotest cookie is set
     * @public @async
     * @returns {Promise<void>}
     */
    public async downloadXml(): Promise<void> {
        await this.init();
        const sitemap: string = this.generateSitemap();;
        sitemap && this.createLinkSitemapAndClick(sitemap);
    }

    /**
     * @private @async
     * @returns {Promise<void>}
     */
    private async init(): Promise<void> {
        await this.configService.ready;
        this.config = this.configService.get<ISitemapConfig>('$base.sitemap');
        this.staticService = await this.injectionService.getService('static.static-service');
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        await this.gamesCatalogService.ready;

        this.initLanguages();
        await this.initPaths();
    }

    /**
     * Creates a link to download the sitemap.xml file and simulates a click on it.
     * @private
     * @param sitemap - XML content of the sitemap.
     * @returns {void}
     */
    private createLinkSitemapAndClick(sitemap: string): void {
        const link: HTMLAnchorElement = this.window.document.createElement('a');
        link.href = URL.createObjectURL(new Blob([sitemap], {type: 'application/xml'}));
        link.download = 'sitemap.xml';
        link.click();
        link.remove();
    }

    /**
     * Initializes the list of languages supported by the application.
     * @private
     * @returns {void}
     */
    private initLanguages(): void {
        const configLanguages: ILanguage[] = this.configService.get<ILanguage[]>('appConfig.languages');
        this.languages = configLanguages.map((language: ILanguage) => language.code);
        const defaultLanguage: string = this.config?.defaultLanguage;

        if (this.languages.includes(defaultLanguage)) {
            this.languages.filter((code: string) => code !== defaultLanguage);
            this.languages.unshift(defaultLanguage);
        }
    }

    /**
     * Initializes the list of paths to include in the sitemap.
     * @private @async
     * @returns {Promise<void>}
     */
    private async initPaths(): Promise<void> {
        const wordpressPaths: string[] = await this.getWordpressPaths();
        const routerPaths: string[] = this.getRouterPaths();
        const allPaths: string[] = [...new Set([...wordpressPaths, ...routerPaths])];

        if (this.config.router.catalog.use) {
            const allCategories: CategoryModel[] = this.gamesCatalogService.getAllCategories();
            allCategories.forEach((category: CategoryModel) => {
                allPaths.push(`/catalog/${category.slug}`);
            });
        }

        this.paths = allPaths
            .filter((path: string) => !this.config.excludePath.includes(path))
            .sort((a: string, b: string) => a.localeCompare(b));
    }

    /**
     * Gets the the sitemap xml
     * @private
     * @returns {string}
     */
    private generateSitemap(): string {
        const content: string = this.generateSitemapUrls();
        const xmlms: string = 'http://www.sitemaps.org/schemas/sitemap/0.9';
        const xhtml: string = 'http://www.w3.org/1999/xhtml';

        const sitemap: string[] = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            `<urlset xmlns="${xmlms}" xmlns:xhtml="${xhtml}">`,
            content,
            '</urlset>',
        ];

        return sitemap.join('\n');
    }

    /**
     * Gets the list of paths to include in the sitemap from the router configuration.
     *
     * @private
     * @returns {string[]} - List of paths to include in the sitemap from the router configuration.
     */
    private getRouterPaths(): string[] {
        const routerState: StateDeclaration[] = this.routerService.get();
        return this.filterRouterState(routerState);
    }

    /**
     * Filters the list of states from the router configuration to get the list of paths to include in the sitemap.
     *
     * @private
     * @param {StateDeclaration[]} states - List of states from the router configuration.
     * @returns {string[]} - List of paths to include in the sitemap from the router configuration.
     */
    private filterRouterState(states: StateDeclaration[]): string[] {
        const paths: string[] = [];
        const {skipRouterNames, includeTokens, excludeRouterNames} = this.config.router;

        for (let i = 0; i < states.length; i++) {
            const state = states[i];
            const {name, resolve, url} = state;
            const routerName: string = name?.split('.')[1];
            const isExcludeRouterName: boolean =
                excludeRouterNames.some((routerName: string) => name.includes(routerName));

            if (isExcludeRouterName) {
                continue;
            }

            if (url && routerName) {

                if (skipRouterNames.includes(routerName)) {
                    push(url);
                }

                if (Array.isArray(resolve)) {
                    const token: string = (resolve[0] as unknown as {token: string})?.token;

                    if (includeTokens.includes(token)) {
                        push(url);
                    }

                    // skip all other resolved tokens
                    continue;
                }
                push(url);
            }
        }

        function push(url: string): void {
            const pathUrl: string[] = url.split(':');
            const path: string = Array.isArray(pathUrl) ? pathUrl[0] : pathUrl;

            if (!path) {
                return;
            };

            const resultPath: string = path.replace(/\//g, '');
            paths.push(`/${resultPath}`);
        }

        return paths;
    }

    /**
     * Gets the list of WordPress paths to include in the sitemap.
     * @private @async
     * @returns {Promise<string[]>} - List of WordPress paths to include in the sitemap.
     */
    private async getWordpressPaths(): Promise<string[]> {
        try {
            const wordpressPages: TextDataModel[] = await this.staticService.getPostsListByCategorySlug(CATEGORY_SLUG);
            return wordpressPages
                .filter(page => !!page.slug && page.slug !== '/')
                .map((page: TextDataModel) => `/contacts/${page.slug}`);
        } catch (error: unknown) {
            console.error(error);
            return [];
        }
    }

    /**
     * Generates the list of URLs to include in the sitemap.
     *
     * @private
     * @returns {string} - The list of URLs to include in the sitemap.
     */
    private generateSitemapUrls(): string {
        const urls: string[] = [];
        const lastModification: string = new Date().toISOString();
        const domain: string = this.window.location.origin;
        this.paths.forEach((path: string, index: number) => {
            const [defaultLanguage, ...otherLanguages] = this.languages;
            const pageUrl: string = `${domain}/${defaultLanguage}${path}`;
            const frequentPageChanges: string = this.config.xmlConfig.frequentPageChanges;
            const priorityIndexing: string = index === 0 ? '1.0' : '0.8';

            const alternates: string[] = [];

            if (otherLanguages?.length) {
                otherLanguages.forEach((language: string) => {
                    const pageUrlAlternate: string = `${domain}/${language}${path}`;
                    const xhtml: string =
                        `<xhtml:link rel="alternate" hreflang="${language}" href="${pageUrlAlternate}" />`;
                    alternates.push(xhtml);
                });
            }

            const url: string[] = [
                '<url>',
                `<loc>${pageUrl}</loc>`,
                `<changefreq>${frequentPageChanges}</changefreq>`,
                `<priority>${priorityIndexing}</priority>`,
                `<lastmod>${lastModification}</lastmod>`,
                `${alternates.length ? alternates.join('\n') : ''}`,
                '</url>',
            ];

            urls.push(url.join('\n'));
        });

        return urls.join('\n');
    }
}

import {
    Ng2StateDeclaration,
    Transition,
} from '@uirouter/angular';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers';
import {ISitemapConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/sitemap-config.interface';
import {
    ConfigService,
    RouterService,
} from 'wlc-engine/modules/core/system/services';
import {SitemapService} from 'wlc-engine/services/sitemap/sitemap.service';

export const sitemapState: Ng2StateDeclaration = {
    url: '/generate-sitemap',
    resolve: [
        {
            token: 'forNotAuthenticated',
            deps: [
                ConfigService,
                RouterService,
                SitemapService,
                Transition,
            ],
            resolveFn: async (
                configService: ConfigService,
                routerService: RouterService,
                sitemapService: SitemapService,
                transition: Transition,
            ): Promise<void> => {
                await configService.ready;
                const config: ISitemapConfig = configService.get<ISitemapConfig>('$base.sitemap');

                if (config && config.use && GlobalHelper.isAutotest()) {
                    await sitemapService.downloadXml();
                    return navigateTo('app.home', transition, routerService);
                }

                return navigateTo('app.error', transition, routerService);
            },
        },
    ],
};

function navigateTo(route: string,transition: Transition, routerService: RouterService): void {
    transition.abort();
    routerService.navigate(route, transition.params());
}

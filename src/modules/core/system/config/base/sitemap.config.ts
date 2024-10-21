import {ISitemapConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/sitemap-config.interface';

// https://wiki.egamings.com/pages/viewpage.action?pageId=162353657
export const sitemapConfig: ISitemapConfig = {
    use: false,
    xmlConfig: {
        // how often to check sitemap
        frequentPageChanges: 'weekly',
    },
    // forced disabling of routes ['/login', '/signup']
    excludePath: [
        '/catalog/vertical',
        '/catalog/lastplayed',
        '/catalog/favourites',
        '/lottery',
    ],
    defaultLanguage: 'en',
    router: {
        catalog: {
            // enable catalog and categories
            use: true,
        },
        // router states names to skip app.catalog.path => ['app.catalog']
        skipRouterNames: [],
        // router states names to exclude app.profile.path => ['app.profile']
        excludeRouterNames: [
            'app.profile',
            'app.sitemap',
            'app.error',
            'app.offline',
            'app.pages',
            'app.instructions',
            'app.contacts',
        ],
        /*
            router states tokens to include => ['forAuthenticated']
            'forAuthenticated',
            'openModal_signup',
            ... etc, see router state
        */
        includeTokens: [],
    },
};

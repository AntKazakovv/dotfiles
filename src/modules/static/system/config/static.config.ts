import {IStaticConfig} from 'wlc-engine/modules/static';

export const staticConfig: IStaticConfig = {
    pages: [
        'terms-and-conditions',
        'privacy-policy',
        'responsible-game',
        'fair-play',
        'games-rules',
    ],
    wpPlugins: {
        wlcApi: false,
        translateMode: 'query',
    },
    cacheExpiry: {
        category: 120 * 60 * 1000,
        post: 120 * 60 * 1000,
        plugin: 120 * 60 * 1000,
        tag: 120 * 60 * 1000,
        page: 120 * 60 * 1000,
    },
    additionalFields: [
        'acf',
    ],
    normalizeInternalLinks: true,
    rewritingLanguages: {
        'pt-br': 'pb',
    },
};

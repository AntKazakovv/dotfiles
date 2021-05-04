import {ISportsbookConfig} from '../interfaces/sportsbook.interface';

export const sportsbookConfig: ISportsbookConfig = {
    betradar: {
        widgets: {
            env: {
                dev: {
                    url: 'https://qa-brserver.egamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://qa-brserver.egamings.com',
                },
                qa: {
                    url: 'https://qa-brserver.egamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://qa-brserver.egamings.com',
                },
                test: {
                    url: 'https://test-brserver.egamings.com:1443/static/widgets/v1/init.js',
                    serverUrl: 'https://test-brserver.egamings.com:1443',
                },
                prod: {
                    url: 'https://api.sportsbet.softgamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://api.sportsbet.softgamings.com',
                },
            },
            popularEvents: {
                imagesDir: '/games/betradar/widgets/popular-events/v1',
            },
        },
    },
};

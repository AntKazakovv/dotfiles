
export const sportsbook = {
    clientId: '1',
        splashScreen: {
        use: false
    },
    betslipPanel: {
        use: false
    },
    widgets: {
        env: {
            dev: {
                url: 'https://qa-brserver.egamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://qa-brserver.egamings.com'
            },
            qa: {
                url: 'https://qa-brserver.egamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://qa-brserver.egamings.com'
            },
            test: {
                url: 'https://test-brserver.egamings.com:1443/static/widgets/v1/init.js',
                    serverUrl: 'https://test-brserver.egamings.com:1443'
            },
            prod: {
                url: 'https://api.sportsbet.softgamings.com/static/widgets/v1/init.js',
                    serverUrl: 'https://api.sportsbet.softgamings.com'
            }
        },
        settings: {
            dailyMatch: {
                widget: 'DAILY_MATCH',
                    customImages: {
                    use: false,
                        dir: '/static/images/betradar/daily-match-widget/'
                }
            },
            popularEvents: {
                widget: 'POPULAR_EVENTS',
                    customImages: {
                    use: false,
                        dir: '/static/images/betradar/popular-events-widget/'
                }
            }
        }
    }
};

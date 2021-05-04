## Game grid component

Games grid component uses to display games of different categories specified in the component parameters.

# Banner inside games grid:

If you want a banner inside the game grid, then you should specify the bannerSettings key in the parameters and specify
parameters according to the interface. If you need to place a banner on the right side, then you need to specify a modifier for the games grid - `banner-right`

``` {
                        name: 'games.wlc-games-grid',
                        params: <IGamesGridCParams>{
                            gamesRows: 2,
                            title: 'Table games',
                            filter: {
                                category: 'tablegames',
                            },
                            usePlaceholders: true,
                            showAllLink: {
                                use: true,
                                useCounter: true,
                                text: 'Show more',
                                link: 'app.catalog',
                                params: {
                                    category: 'tablegames',
                                },
                            },
                            bannerSettings: {
                                sliderParams: {
                                    swiper: {
                                        init: false,
                                    },
                                },
                                banner: {
                                    theme: 'game-banner',
                                },
                                filter: {
                                    position: ['games-grid-banner'],
                                },
                            },
                            moreBtn: {
                                hide: true,
                                lazy: false,
                            },
                        },
                    },```



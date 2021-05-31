## Game grid component

Games grid component uses to display games of different categories specified in the component parameters.

# Banner inside games grid:

If you want a banner inside the game grid, then you should specify the bannerSettings key in the parameters and specify
parameters according to the interface. If you need to place a banner on the right side, then you need to specify a modifier for the games grid - `banner-right`

``` 
{
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
},
```

# Header as a grid item  

When to use a header as a grid item as in the [example](https://www.figma.com/file/leOQ5AVMiPSerCfxVvo1ZV/TK%3A-CATCASINO?node-id=0%3A1). You need to specify a themeMod `header-inline`

``` 
{
    name: 'games.wlc-games-grid',
    params: {
        themeMod: 'header-inline',
        gamesRows: 1,
        title: 'Top games',
        titleIcon: {
            name: 'top-games-icon',
        },
        showAllLink: {
            use: true,
            link: 'app.catalog',
            text: 'Show more',
        },
        moreBtn: {
            hide: true,
            lazy: false,
        },
        tabletSettings: {
            gamesRows: 2,
        },
        mobileSettings: {
            gamesRows: 3,
        },
    },
},
```

# Breakpoints 

To use breakpoints, you need to use the construction as in the example, where is the key is the min-width screen.

``` 
{
    name: 'games.wlc-games-grid',
    params: {
        ...
        breakpoints: {
            375 : {
                gamesRows: 2,
            },
            1630 : {
                gamesRows: 3,
            },
        },
    },
},
```

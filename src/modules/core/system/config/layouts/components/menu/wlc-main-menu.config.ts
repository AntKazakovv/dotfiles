import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcMainMenu {
    export const header: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        display: {
            after: 1366,
        },
        params: {
            wlcElement: 'block_main-nav',
            common: {
                useSwiperNavigation: true,
            },
            menuParams: {
                common: {
                    useSwiper: true,
                },
                sliderParams: {
                    swiper: {
                        spaceBetween: 40,
                    },
                },
            },
        },
    };

    export const burgerPanel: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'underline',
            type: 'burger-menu',
            wlcElement: 'block_main-nav-panel',
        },
    };

    export const burgerPanelIcons: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'underline',
            type: 'burger-menu',
            wlcElement: 'block_main-nav-panel',
            common: {
                icons: {
                    folder: 'wlc/icons/european/v1',
                    use: true,
                },
            },
        },
    };

    export const fixedBurger: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'fixed-burger',
            type: 'fixed-burger',
            wlcElement: 'block_main-nav-panel',
            common: {
                icons: {
                    folder: 'wlc/icons/european/v1',
                    use: true,
                },
            },
        },
    };

    export const burgerPanelIconsOption3: ILayoutComponent = {
        name: 'menu.wlc-main-menu',
        params: {
            theme: 'burger-panel',
            themeMod: 'underline',
            type: 'main-menu',
            wlcElement: 'block_main-nav-panel',
            common: {
                icons: {
                    folder: 'wlc/icons/burger-panel/1',
                    use: true,
                },
            },
        },
    };

    export const affiliates: ILayoutComponent = {
        name: 'affiliates.wlc-affiliates-menu',
        params: {
            type: 'main-menu',
            wlcElement: 'block_main-nav',
        },
    };
}

import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcCategoryMenu {
    export const categories: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            type: 'categories-menu',
            common: {
                useSwiperNavigation: true,
            },
        },
    };
    export const categoriesWithIcons: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            theme: 'with-icons',
            type: 'categories-menu',
            common: {
                useSwiperNavigation: true,
                icons: {
                    use: true,
                },
            },
        },
    };
    export const categoriesWithIconsBig: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            theme: 'with-icons',
            themeMod: 'big-icons',
            type: 'categories-menu',
            common: {
                useSwiperNavigation: true,
                icons: {
                    use: true,
                },
            },
        },
    };
    export const iconsCompact: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            theme: 'icons-compact',
            common: {
                useSwiperNavigation: true,
                icons: {
                    use: true,
                },
            },
        },
    };
    export const iconsCompactUnderlined: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        display: {
            after: 768,
        },
        params: {
            theme: 'icons-compact',
            themeMod: 'underlined',
            common: {
                useSwiperNavigation: true,
                icons: {
                    use: true,
                },
            },
        },
    };
}

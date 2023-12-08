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
                useSliderNavigation: true,
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 5,
                    },
                },
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
                useSliderNavigation: true,
                icons: {
                    use: true,
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 10,
                    },
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
                useSliderNavigation: true,
                icons: {
                    use: true,
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 8,
                    },
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
                useSliderNavigation: true,
                icons: {
                    use: true,
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 15,
                    },
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
                useSliderNavigation: true,
                icons: {
                    use: true,
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 15,
                    },
                },
            },

        },
    };
    export const categoriesWolf: ILayoutComponent = {
        name: 'menu.wlc-category-menu',
        params: {
            theme: 'wolf',
            common: {
                useSliderNavigation: true,
                icons: {
                    use: true,
                    folder: 'wlc/icons/theme-wolf/categories',
                },
            },
            menuParams: {
                sliderParams: {
                    swiper: {
                        spaceBetween: 36,
                        breakpoints: {
                            375: {
                                spaceBetween: 0,
                            },
                            900: {
                                spaceBetween: 18,
                            },
                        },
                    },
                },
            },
        },
    };
}

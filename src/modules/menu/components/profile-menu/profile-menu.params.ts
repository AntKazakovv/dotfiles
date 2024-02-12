import {
    IComponentParams,
    CustomType,
    TDeviceSelection,
} from 'wlc-engine/modules/core';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IProfileMenuItemsGroup<T> {
    parent: T;
    type: string;
    items: T[];
}
export interface IProfileMenuFilter {
    config: string;
    item: string;
}

export type Type = 'tabs' | 'submenu' | 'dropdown' | 'full' | CustomType;
export type Theme = 'default' | 'wolf' | CustomType;
export type ThemeMod = 'default' | CustomType;
export type AutoModifiers = Theme | ThemeMod;
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISliderNavigation {
    forDevice: TDeviceSelection;
    use?: boolean;
}

export interface ITabsMenu {
    menuParams: MenuParams.IMenuCParams;
    /** Use slider arrows for menu or not */
    sliderNavigation?: ISliderNavigation;
}

export interface ISubMenu {
    menuParams: MenuParams.IMenuCParams;
    /** Use slider arrows for menu or not */
    sliderNavigation?: ISliderNavigation;
}
export interface IMenuParams {
    tabs: ITabsMenu;
    submenu: ISubMenu;
}

export interface IProfileMenuCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    common?: {
        themeMod?: ThemeMod;
        useArrow?: boolean;
        useSliderNavigation?: boolean;
        useSwiper?: boolean;
        icons?: {
            folder?: string;
            use?: boolean;
        };
    };
}

export const defaultMenuParams: IMenuParams = {
    tabs: {
        sliderNavigation: {
            use: true,
            forDevice: 'any',
        },
        menuParams: {
            common: {
                useSwiper: true,
            },
            sliderParams: {
                swiper: {
                    spaceBetween: 5,
                    navigation: {
                        nextEl: '.wlc-profile-menu--type-tabs .wlc-profile-menu__control--next',
                        prevEl: '.wlc-profile-menu--type-tabs .wlc-profile-menu__control--prev',
                    },
                },
            },
        },
    },
    submenu: {
        sliderNavigation: {
            use: true,
            forDevice: 'desktop',
        },
        menuParams: {
            common: {
                useSwiper: true,
            },
            sliderParams: {
                swiper: {
                    spaceBetween: 30,
                    navigation: {
                        nextEl: '.wlc-profile-menu--type-submenu .wlc-profile-menu__control--next',
                        prevEl: '.wlc-profile-menu--type-submenu .wlc-profile-menu__control--prev',
                    },
                },
            },
        },
    },
};

export const wolfMenuParams: IMenuParams = {
    tabs: {
        sliderNavigation: {
            use: true,
            forDevice: 'any',
        },
        menuParams: {
            common: {
                useSwiper: true,
            },
            sliderParams: {
                swiper: {
                    navigation: {
                        nextEl: '.wlc-profile-menu--type-tabs .wlc-profile-menu__control--next',
                        prevEl: '.wlc-profile-menu--type-tabs .wlc-profile-menu__control--prev',
                    },
                    breakpoints: {
                        375: {
                            spaceBetween: 0,
                        },
                        900: {
                            spaceBetween: 18,
                        },
                        1024: {
                            spaceBetween: 43,
                        },
                    },
                },
            },
        },
    },
    submenu: {
        sliderNavigation: {
            use: false,
            forDevice: 'desktop',
        },
        menuParams: {
            common: {
                useSwiper: true,
            },
            sliderParams: {
                swiper: {
                    spaceBetween: 12,
                },
            },
        },
    },
};

export const menuConfigs = {
    default: defaultMenuParams,
    wolf: wolfMenuParams,
};

export const defaultParams: IProfileMenuCParams = {
    moduleName: 'menu',
    componentName: 'wlc-profile-menu',
    class: 'wlc-profile-menu',
    theme: 'default',
};

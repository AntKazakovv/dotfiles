import {ILayoutSectionConfig} from 'wlc-engine/modules/core';
import * as componentLib from '../components';

export namespace categories {
    export const catalog: ILayoutSectionConfig =  {
        container: true,
        theme: '1',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categories,
                        componentLib.wlcButton.search,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
    export const catalogWithDropdownSearch: ILayoutSectionConfig = {
        container: true,
        theme: '1',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories games-categories--dropdown-search',
                    components: [
                        componentLib.wlcCategoryMenu.categories,
                        componentLib.wlcButton.searchV4,
                        componentLib.wlcDropdownSearch.def,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
    export const catalogWithIcons: ILayoutSectionConfig = {
        replaceConfig: true,
        container: true,
        theme: '2',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categoriesWithIcons,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'games-categories__wrapper',
                                components: [
                                    componentLib.wlcButton.search,
                                    componentLib.wlcButton.searchMerchants,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
    export const catalogIconsDropdownSearch: ILayoutSectionConfig = {
        replaceConfig: true,
        container: true,
        theme: '2',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories games-categories--dropdown-search',
                    components: [
                        componentLib.wlcCategoryMenu.categoriesWithIcons,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'games-categories__wrapper',
                                components: [
                                    componentLib.wlcButton.searchV4,
                                    componentLib.wlcDropdownSearch.def,
                                    componentLib.wlcButton.searchMerchants,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
    export const catalogWithIconsBig: ILayoutSectionConfig = {
        replaceConfig: true,
        container: true,
        theme: '2',
        modifiers: ['without-back'],
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.categoriesWithIconsBig,
                        {
                            name: 'core.wlc-wrapper',
                            params: {
                                class: 'games-categories__wrapper',
                                components: [
                                    componentLib.wlcButton.search,
                                    componentLib.wlcButton.searchMerchants,
                                ],
                            },
                        },
                    ],
                },
            },
        ],
    };
    export const iconsCompact: ILayoutSectionConfig = {
        replaceConfig: true,
        container: true,
        theme: '1',
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.iconsCompact,
                        componentLib.wlcButton.search,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
    export const iconsCompactUnderlined: ILayoutSectionConfig = {
        replaceConfig: true,
        container: true,
        theme: '1',
        modifiers: ['without-back'],
        components: [
            {
                name: 'core.wlc-wrapper',
                params: {
                    class: 'games-categories',
                    components: [
                        componentLib.wlcCategoryMenu.iconsCompactUnderlined,
                        componentLib.wlcButton.search,
                        componentLib.wlcButton.searchMerchants,
                    ],
                },
            },
        ],
    };
}

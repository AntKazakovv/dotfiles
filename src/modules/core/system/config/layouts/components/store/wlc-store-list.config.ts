import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcStoreList {
    export const def: ILayoutComponent = {
        name: 'store.wlc-store-list',
        params: {
            filterIconPath: '/wlc/icons/filter.svg',
            common: {
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        640: {
                            itemPerPage: 4,
                        },
                        720: {
                            itemPerPage: 6,
                        },
                    },
                },
                storeItemParams: {
                    infoIcon: '/wlc/icons/info-3.svg',
                    lockIcon: '/wlc/icons/lock-icon.svg',
                    tagTheme: 'text',
                    buyBtnParams: {
                        common: {
                            text: gettext('Buy now'),
                            typeAttr: 'button',
                        },
                        wlcElement: 'button_buy',
                    },
                },
            },
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'store.wlc-store-list',
        params: {
            themeMod: 'wolf',
            filterIconPath: '/wlc/icons/filter-wolf.svg',
            common: {
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        640: {
                            itemPerPage: 4,
                        },
                        900: {
                            itemPerPage: 6,
                        },
                    },
                },
                storeItemParams: {
                    infoIcon: '/wlc/icons/theme-wolf/interface/info.svg',
                    lockIcon: '/wlc/icons/theme-wolf/interface/locked.svg',
                    tagTheme: 'default',
                    buyBtnParams: {
                        common: {
                            text: gettext('Buy now'),
                            typeAttr: 'button',
                            size: 'md',
                        },
                        wlcElement: 'button_buy',
                    },
                },
            },
        },
    };
}

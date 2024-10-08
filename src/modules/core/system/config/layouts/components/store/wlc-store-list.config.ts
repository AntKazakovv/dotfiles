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
            },
        },
    };

    export const first: ILayoutComponent = {
        name: 'store.wlc-store-list',
        params: {
            themeMod: 'first',
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
                        900: {
                            itemPerPage: 6,
                        },
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
            },
        },
    };
}

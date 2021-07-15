import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcStoreList {
    export const def: ILayoutComponent = {
        name: 'store.wlc-store-list',
        params: {
            common: {
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                        720: {
                            itemPerPage: 4,
                        },
                        1024: {
                            itemPerPage: 6,
                        },
                        1366: {
                            itemPerPage: 8,
                        },
                        1630: {
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
                        1024: {
                            itemPerPage: 4,
                        },
                        1200: {
                            itemPerPage: 6,
                        },
                    },
                },
            },
        },
    };
}

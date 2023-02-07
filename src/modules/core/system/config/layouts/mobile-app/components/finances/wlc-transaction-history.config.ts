import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcTransactionHistory {
    export const def: ILayoutComponent = {
        name: 'finances.wlc-transaction-history',
        params: {
            transactionTableTheme: 'mobile-app',
        },
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                {
                    name: 'core.wlc-history-filter',
                    params: {
                        config: 'transaction',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const filterTypeFirst: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.cashV1Mobile,
                {
                    ...wlcTitle.history,
                    display: {
                        after: 1200,
                    },
                },
                {
                    name: 'core.wlc-history-filter',
                    params: {
                        config: 'transaction',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const filterOnly: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            config: 'transaction',
        },
        display: {
            before: 1023,
        },
    };
}

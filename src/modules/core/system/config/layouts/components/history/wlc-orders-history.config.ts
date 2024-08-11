import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcOrdersHistory {
    
    export const def: ILayoutComponent = {
        name: 'history.wlc-orders-history',
    };

    export const wolf: ILayoutComponent = {
        name: 'history.wlc-orders-history',
        params: {
            theme: 'wolf',
        },
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.history,
                {
                    name: 'history.wlc-history-filter',
                    params: {
                        config: 'orders',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const filterOnly: ILayoutComponent = {
        name: 'history.wlc-history-filter',
        params: {
            config: 'orders',
        },
        display: {
            before: 1023,
        },
    };

    export const filterTypeFirst: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                {
                    name: 'history.wlc-history-filter',
                    params: {
                        config: 'orders',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };
};

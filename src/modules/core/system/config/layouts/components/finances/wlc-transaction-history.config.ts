import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcTransactionHistory {
    export const def: ILayoutComponent = {
        name: 'finances.wlc-transaction-history',
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.history,
                {
                    name: 'finances.wlc-history-filter',
                    params: {
                        config: 'transaction',
                    },
                    display: {
                        before: 1024,
                    },
                },
            ],
        },
    };
}

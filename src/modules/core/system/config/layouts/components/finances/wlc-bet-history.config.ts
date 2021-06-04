import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from "wlc-engine/modules/core/system/config/layouts/components";

export namespace wlcBetHistory {
    export const def: ILayoutComponent = {
        name: 'finances.wlc-bet-history',
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.betHistory,
                {
                    name: 'finances.wlc-history-filter',
                    params: {
                        config: 'bet',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const filterOnly: ILayoutComponent = {
        name: 'finances.wlc-history-filter',
        params: {
            config: 'bet',
        },
        display: {
            before: 1023,
        },
    };
};

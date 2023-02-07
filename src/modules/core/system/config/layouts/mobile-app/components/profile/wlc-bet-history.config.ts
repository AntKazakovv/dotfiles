import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcBetHistory {
    export const def: ILayoutComponent = {
        name: 'profile.wlc-bet-history',
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
        name: 'core.wlc-history-filter',
        params: {
            config: 'bet',
        },
        display: {
            before: 1023,
        },
    };
};

import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcBonusesHistory {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-history',
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
                        config: 'bonus',
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
            config: 'bonus',
        },
    };

    export const filterOnlyV1: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            config: 'bonus',
        },
        display: {
            before: 1023,
        },
    };
}

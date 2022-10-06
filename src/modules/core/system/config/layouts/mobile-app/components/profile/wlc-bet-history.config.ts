import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcBetHistory {
    export const def: ILayoutComponent = {
        name: 'profile.wlc-bet-history',
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.history,
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

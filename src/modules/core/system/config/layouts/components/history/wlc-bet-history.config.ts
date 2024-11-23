import {wlcTitle} from 'wlc-engine/modules/core/components/title/title.config';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcBetHistory {
    export const def: ILayoutComponent = {
        name: 'history.wlc-bet-history',
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
        name: 'history.wlc-history-filter',
        params: {
            config: 'bet',
        },
        display: {
            before: 1023,
        },
    };
};

import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcBonusesHistory {
    export const def: ILayoutComponent = {
        name: 'history.wlc-bonuses-history',
        params: {
            tableConfig: {
                theme: 'mobile-app',
            },
        },
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

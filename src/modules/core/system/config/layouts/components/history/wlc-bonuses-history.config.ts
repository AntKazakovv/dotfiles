import {wlcTitle} from 'wlc-engine/modules/core/components/title/title.config';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcBonusesHistory {
    export const def: ILayoutComponent = {
        name: 'history.wlc-bonuses-history',
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
        name: 'history.wlc-history-filter',
        params: {
            config: 'bonus',
        },
    };

    export const filterOnlyV1: ILayoutComponent = {
        name: 'history.wlc-history-filter',
        params: {
            config: 'bonus',
        },
        display: {
            before: 1023,
        },
    };
}

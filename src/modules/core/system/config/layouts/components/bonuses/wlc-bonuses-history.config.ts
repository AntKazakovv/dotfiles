import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from "wlc-engine/modules/core/system/config/layouts/components";

export namespace wlcBonusesHistory {
    export const def: ILayoutComponent = {
        name: 'bonuses.wlc-bonuses-history',
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.bonusesHistory,
                {
                    name: 'finances.wlc-history-filter',
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
        name: 'finances.wlc-history-filter',
        params: {
            config: 'bonus',
        },
    };
}

import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components';

export namespace wlcTournamentsHistory {
    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.tournamentsHistory,
                {
                    name: 'finances.wlc-history-filter',
                    params: {
                        config: 'tournaments',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const def: ILayoutComponent = {
        name: 'tournaments.wlc-tournaments-history',
    };
}

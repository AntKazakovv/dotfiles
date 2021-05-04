import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcTournamentList {
    export const def: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            theme: 'default',
        },
    };

    export const available: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            theme: 'available',
            common: {
                thumbType: 'available',
            },
        },
    };
}

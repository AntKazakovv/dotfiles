import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ITournamentListCParams} from 'wlc-engine/modules/tournaments';

export namespace wlcTournamentList {
    export const def: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: <ITournamentListCParams>{
            type: 'default',
            useNoTournamentsBtn: true,
        },
    };

    export const available: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            type: 'available',
            common: {
                thumbType: 'available',
                customMod: 'available',
            },
        },
    };

    export const availableFirst: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            type: 'available',
            inProfile: true,
            common: {
                thumbType: 'available',
                customMod: 'available',
                pagination: {
                    use: true,
                    breakpoints: {
                        0: {
                            itemPerPage: 3,
                        },
                    },
                },
            },
        },
    };

    export const active: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            type: 'active',
            inProfile: true,
            common: {
                thumbType: 'active',
                customMod: 'active',
                restType: 'active',
            },
        },
    };

    export const detail: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            type: 'detail',
            common: {
                thumbType: 'detail',
                customMod: 'detail',
                restType: 'any',
            },
        },
    };
}

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
                customMod: 'available',
            },
        },
    };

    export const availableFirst: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            theme: 'available',
            common: {
                thumbType: 'available',
                customMod: 'available',
                pagination: {
                    use: true,
                    breakpoints: {
                        375: {
                            itemPerPage: 2,
                        },
                    },
                },
            },
        },
    };

    export const active: ILayoutComponent = {
        name: 'tournaments.wlc-tournament-list',
        params: {
            theme: 'active',
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
            theme: 'detail',
            common: {
                thumbType: 'detail',
                customMod: 'detail',
                restType: 'any',
            },
        },
    };
}

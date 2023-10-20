'use strict';

import {
    Ng2StateDeclaration,
    StateService,
    Transition,
} from '@uirouter/angular';

import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {TournamentsService} from 'wlc-engine/modules/tournaments';

export const profileTournamentsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-tournaments',
};

export const profileTournamentsMainState: Ng2StateDeclaration = {
    url: '',
};

export const profileTournamentsHistoryState: Ng2StateDeclaration = {
    url: '/history',
};

export const profileTournamentsDetailState: Ng2StateDeclaration = {
    url: '/:tournamentId',
    resolve: [
        {
            token: 'tournamentId',
            deps: [
                Transition,
                StateService,
                TournamentsService,
            ],
            resolveFn: async (
                transition: Transition,
                stateService: StateService,
                tournamentService: TournamentsService,
            ) => {
                const result = new Deferred();
                const tournamentId = transition.params().tournamentId;
                const tournament = await tournamentService.getTournament(tournamentId);

                if (tournament) {
                    result.resolve();
                } else {
                    result.reject();
                    stateService.go('app.error', transition.params());
                }

                return result.promise;
            },
        },
    ],
};


'use strict';

import {
    Ng2StateDeclaration,
    StateService,
    Transition,
} from '@uirouter/angular';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
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
                InjectionService,
            ],
            resolveFn: async (
                transition: Transition,
                stateService: StateService,
                injectionService: InjectionService,
            ) => {
                const tournamentService = await injectionService
                    .getService<TournamentsService>('tournaments.tournaments-service');

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


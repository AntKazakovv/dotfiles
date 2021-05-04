'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileTournamentsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-tournaments',
};

export const profileTournamentsMainState: Ng2StateDeclaration = {
    url: '',
};

export const profileTournamentsActiveState: Ng2StateDeclaration = {
    url: '/active',
    resolve: [
        StateHelper.profileTypeResolver('first'),
    ],
};

export const profileTournamentsHistoryState: Ng2StateDeclaration = {
    url: '/history',
};

export const profileTournamentsDetailState: Ng2StateDeclaration = {
    url: '/:tournamentId',
};


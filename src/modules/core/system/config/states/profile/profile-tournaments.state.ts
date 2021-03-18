'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export const profileTournamentsState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-tournaments',
};

export const profileTournamentsMainState: Ng2StateDeclaration = {
    url: '',
};

export const profileTournamentsActiveState: Ng2StateDeclaration = {
    url: '/active',
};

export const profileTournamentsHistoryState: Ng2StateDeclaration = {
    url: '/history',
};

export const profileTournamentsDetailState: Ng2StateDeclaration = {
    url: '/:tournamentId',
};


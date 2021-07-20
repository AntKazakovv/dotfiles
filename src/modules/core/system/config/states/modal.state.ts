'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core';

export const loginState: Ng2StateDeclaration = {
    url: '/login',
    resolve: [
        StateHelper.openModalResolver('login'),
    ],
};

export const signUpState: Ng2StateDeclaration = {
    url: '/signup',
    resolve: [
        StateHelper.openModalResolver('signup'),
    ],
};

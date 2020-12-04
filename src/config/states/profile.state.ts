'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export namespace profile {
    export const main: Ng2StateDeclaration = {
        url: '/profile',
    };

    export const deposit: Ng2StateDeclaration = {
        url: '/deposit',
    };

    export const withdraw: Ng2StateDeclaration = {
        url: '/withdraw',
    };

    export const transaction: Ng2StateDeclaration = {
        url: '/transaction-history',
    };
}

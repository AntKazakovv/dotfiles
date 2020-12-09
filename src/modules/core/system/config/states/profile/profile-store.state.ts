'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export const profileStoreState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-store',
};

export const profileStoreMain: Ng2StateDeclaration = {
    url: '?category',
};

export const profileStoreOrders: Ng2StateDeclaration = {
    url: '/orders',
};

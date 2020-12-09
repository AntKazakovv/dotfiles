'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
};

export const catalogChildState: Ng2StateDeclaration = {
    url: '/:childCategory',
};

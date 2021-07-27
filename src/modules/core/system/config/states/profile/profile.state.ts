'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileState: Ng2StateDeclaration = {
    url: '/profile',
    resolve: [
        StateHelper.forAuthenticatedResolver(),
    ],
};

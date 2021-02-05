'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileHistoryState: Ng2StateDeclaration = {
    url: '/history',
    resolve: [
        StateHelper.forAuthenticatedResolver(),
    ],
};


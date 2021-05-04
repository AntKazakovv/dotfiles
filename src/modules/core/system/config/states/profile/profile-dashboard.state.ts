'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileDashboardState: Ng2StateDeclaration = {
    url: '/dashboard',
    resolve: [
        StateHelper.profileTypeResolver(),
    ],
};

'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core';

export const marathonState: Ng2StateDeclaration = {
    url: '/marathon',
    resolve: [
        StateHelper.profileStateResolver('$base.marathon.use'),
    ],
};

'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileAchievementsState: Ng2StateDeclaration = {
    url: '/achievements',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.achievements.use'),
    ],
};

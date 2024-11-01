'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers';

export const profileReferralState: Ng2StateDeclaration = {
    url: '/referral',
    resolve: [
        StateHelper.profileStateResolver('appConfig.siteconfig.EnableRefferals'),
    ],
};

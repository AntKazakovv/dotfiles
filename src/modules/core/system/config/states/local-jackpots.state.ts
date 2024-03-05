import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers';

export const localJackpotsState: Ng2StateDeclaration = {
    url: '/my-jackpots',
    resolve: [
        StateHelper.profileStateResolver('appConfig.siteconfig.LocalJackpots'),
    ],
};

import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const localJackpotsState: Ng2StateDeclaration = {
    url: '/my-jackpots',
    resolve: [
        StateHelper.profileStateResolver('appConfig.siteconfig.LocalJackpots'),
    ],
};

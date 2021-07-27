import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileSocialState: Ng2StateDeclaration = {
    url: '/social',
    resolve: [
        StateHelper.forAuthenticatedResolver(),
        StateHelper.profileStateResolver('$base.profile.socials.usePage'),
    ],
};

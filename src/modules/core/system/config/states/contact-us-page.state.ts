import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const contactUsState: Ng2StateDeclaration = {
    url: '/contact-us',
    resolve: [
        StateHelper.profileStateResolver('$base.contacts.separatedPage'),
    ],
};

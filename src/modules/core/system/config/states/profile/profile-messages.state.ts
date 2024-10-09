'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileMessagesState: Ng2StateDeclaration = {
    url: '/messages',
    resolve: [
        StateHelper.forAuthenticatedResolver(),
        StateHelper.profileStateResolver('$base.profile.messages.use'),
    ],
};

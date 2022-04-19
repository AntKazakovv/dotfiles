'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {InjectionService} from 'wlc-engine/modules/core';
import {InternalMailsService} from 'wlc-engine/modules/internal-mails';

export const profileMessagesState: Ng2StateDeclaration = {
    url: '/messages',
    resolve: [
        StateHelper.forAuthenticatedResolver(),
        StateHelper.profileStateResolver('$base.profile.messages.use'),
    ],
    onEnter: async (trans: Transition): Promise<void> => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        const internalMailsService: InternalMailsService = await injectionService
            .getService('internal-mails.internal-mails-service');

        internalMailsService.getMails();
    },
};

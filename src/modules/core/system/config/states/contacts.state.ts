'use strict';

import {
    Ng2StateDeclaration,
    Transition,
} from '@uirouter/angular';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

export const contactsState: Ng2StateDeclaration = {
    url: '/contacts/:slug',
    onEnter: async (trans: Transition) => {
        const configService: ConfigService = trans.injector().get(ConfigService);
        await configService.ready;
        if (configService.get<boolean>('$base.contacts.separatedPage') && trans.params().slug === 'feedback') {
            trans.abort();
            trans.router.stateService.go('app.contact-us', trans.params());
        }
    },
};

'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

import {
    hidePwaNotification,
    hidePwaNotificationStorage,
} from 'wlc-engine/modules/pwa/constants';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

export const instructionsState: Ng2StateDeclaration = {
    url: '/instructions/:slug',
    onEnter: async ($transition) => {
        const configService: ConfigService = $transition.injector().get(ConfigService);
        configService.set({
            name: hidePwaNotification,
            value: true,
            storageType: hidePwaNotificationStorage,
        });
    },
};

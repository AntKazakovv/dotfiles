'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {ConfigService, EventService} from 'wlc-engine/modules/core';

export const errorPageState: Ng2StateDeclaration = {
    url: '/error',
    onEnter: async (trans) => {
        const configService = trans.injector().get(ConfigService);
        const eventService = trans.injector().get(EventService);
        await configService.ready;
        const timeout = configService.get('$base.app.toHomeFromErrorTimeout');
        if (timeout) {
            const timeoutId = setTimeout(() => {
                trans.router.stateService.go('app.home');
            }, timeout);
            eventService.emit({
                name: 'ERROR_PAGE_ENTER',
                data: timeoutId,
            });
        }

    },
    onExit: (trans) => {
        const eventService = trans.injector().get(EventService);
        eventService.emit({
            name: 'ERROR_PAGE_LEAVE',
        });
    },
};

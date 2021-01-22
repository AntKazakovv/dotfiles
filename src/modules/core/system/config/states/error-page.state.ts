'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {ConfigService} from 'wlc-engine/modules/core';

export const errorPageState: Ng2StateDeclaration = {
    url: '/error',
    onEnter: (trans) => {
        const timeout = trans.injector().get('timeout');
        timeout && setTimeout(() => {
            trans.router.stateService.go('app.home');
        }, timeout);
    },
    resolve: [
        {
            token: 'timeout',
            deps: [ConfigService],
            resolveFn: async (config: ConfigService): Promise<string> => {
                await config.ready;
                return  config.get<string>('$base.app.toHomeFromErrorTimeout');
            },
        },
    ],
};

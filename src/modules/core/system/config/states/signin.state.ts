import {Ng2StateDeclaration} from '@uirouter/angular';
import {
    Transition,
    StateService,
} from '@uirouter/core';

import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

export const signin: Ng2StateDeclaration = {
    url: '/signin',
    resolve: [
        {
            token: 'forNotAuthenticated',
            deps: [
                ConfigService,
                StateService,
                Transition,
            ],
            resolveFn: async (
                configService: ConfigService,
                stateService: StateService,
                transition: Transition,
            ) => {
                const result = new Deferred();

                await configService.ready;

                if (!configService.get('$user.isAuthenticated')) {
                    result.resolve();
                } else {
                    result.reject();
                    stateService.go('app.home', transition.params());
                }

                return result.promise;
            },
        },
    ],
};

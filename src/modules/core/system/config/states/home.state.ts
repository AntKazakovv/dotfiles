'use strict';

import {
    Ng2StateDeclaration,
    StateService,
    Transition,
} from '@uirouter/angular';

import {IRedirectAfterLoad} from 'wlc-engine/modules/core/system/interfaces';
import {
    CachingService,
    ConfigService,
} from 'wlc-engine/modules/core/system/services';


export const homeState: Ng2StateDeclaration = {
    url: '',
    resolve: [
        {
            token: 'redirectAfterLoad',
            deps: [
                ConfigService,
                Transition,
                StateService,
                CachingService,
            ],

            resolveFn: async (
                configService: ConfigService,
                transition: Transition,
                stateService: StateService,
                cachingService: CachingService,
            ): Promise<void> => {
                await configService.ready;
                const redirects: IRedirectAfterLoad
                    = configService.get<IRedirectAfterLoad>('$base.redirects.redirectAfterLoad');

                if (
                    redirects
                    && !transition.$from().name
                    && (!await cachingService.get<boolean>('was-be-redirect')
                        || redirects.repeatRedirect)
                ) {
                    await cachingService.set<boolean>('was-be-redirect', true, true, Number.MAX_SAFE_INTEGER);
                    setTimeout(async (): Promise<void> => {
                        stateService.go(redirects.state, transition.params());
                    });
                }
            },
        },
    ],
};

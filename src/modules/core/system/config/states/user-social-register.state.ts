import {
    ResolveTypes,
    StateService,
    Transition,
} from '@uirouter/core';
import {Ng2StateDeclaration} from '@uirouter/angular';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';

const socialRegisterResolver = (): ResolveTypes => {
    return {
        token: 'userSocialRegister',
        deps: [
            StateService,
            Transition,
            InjectionService,
        ],
        resolveFn: async (
            stateService: StateService,
            transition: Transition,
            injectionService: InjectionService,
        ) => {

            const userService = await injectionService.getService<UserService>('user.user-service');

            if (userService.isAuthenticated) {
                setTimeout(() => {
                    stateService.go('app.error', transition.params());
                });
            } else {
                const socialService = await injectionService.getService<SocialService>('user.social-service');
                setTimeout( async () => {
                    await stateService.go('app.home', transition.params());
                    socialService.continueRegistration();
                });
            }
        },
    };
};

export const userSocialRegister: Ng2StateDeclaration = {
    url: '/user-social-register',
    resolve: [
        socialRegisterResolver(),
    ],
};

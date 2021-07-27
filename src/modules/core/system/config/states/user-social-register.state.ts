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
            SocialService,
            InjectionService,
            UserService,
        ],
        resolveFn: async (
            stateService: StateService,
            transition: Transition,
            socialService: SocialService,
            injectionService: InjectionService,
            userService: UserService,
        ) => {
            await injectionService.importModules(['user']);

            if (userService.isAuthenticated) {
                setTimeout(() => {
                    stateService.go('app.error', transition.params());
                });
            } else {
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

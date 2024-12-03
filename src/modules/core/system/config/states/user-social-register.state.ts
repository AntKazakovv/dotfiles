import {
    ResolveTypes,
    Transition,
} from '@uirouter/core';
import {Ng2StateDeclaration} from '@uirouter/angular';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {RouterService} from 'wlc-engine/modules/core/system/services/router/router.service'; 

const socialRegisterResolver = (): ResolveTypes => {
    return {
        token: 'userSocialRegister',
        deps: [
            RouterService,
            Transition,
            InjectionService,
        ],
        resolveFn: async (
            routerService: RouterService,
            transition: Transition,
            injectionService: InjectionService,
        ): Promise<void> => {

            const userService = await injectionService.getService<UserService>('user.user-service');

            if (userService.isAuthenticated) {
                setTimeout(() => {
                    routerService.navigate('app.error', transition.params());
                });
            } else {
                const socialService = await injectionService.getService<SocialService>('user.social-service');
                setTimeout( async () => {
                    await routerService.navigate('app.home', transition.params());
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

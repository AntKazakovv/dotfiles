import {
    Transition,
    StateDeclaration,
    ResolveTypes,
    StateService,
} from '@uirouter/core';

import {ConfigService, LayoutService, ModalService} from 'wlc-engine/modules/core/system/services';
import {LazyLoadResult} from '@uirouter/core/lib/state/interface';
import {Deferred} from 'wlc-engine/modules/core/system/classes';

export class StateHelper {
    public static onStateEnter(trans: Transition) {
        const params = trans.params();
        if (!params.locale) {
            trans.abort();
            trans.router.stateService.go('app.home', {
                locale: trans.injector().get('lang') || 'en',
            });
        }
    }

    public static lazyLoadModules(modules: string[]): (transition: Transition, state: StateDeclaration) => Promise<LazyLoadResult> {
        return async ($transition) => {
            const configService: ConfigService = $transition.injector().get(ConfigService);
            await configService.ready;
            const layoutService: LayoutService = $transition.injector().get(LayoutService);
            await layoutService.importModules(modules);
            return {};
        };
    }

    public static forAuthenticatedResolver(): ResolveTypes {
        return {
            token: 'forAuthenticated',
            deps: [
                ConfigService,
                StateService,
                Transition,
                LayoutService,
                ModalService,
            ],
            resolveFn: async (
                configService: ConfigService,
                stateService: StateService,
                transition: Transition,
                layoutService: LayoutService,
                modalService: ModalService,
            ) => {
                const result = new Deferred();

                await configService.ready;
                await layoutService.importModules(['user']);

                if (configService.get('$user.isAuthenticated')) {
                    result.resolve();
                } else {
                    result.reject();
                    stateService.go('app.home', transition.params());
                    modalService.showModal('login');
                }
                return result.promise;
            },
        };
    }

    public static profileTypeResolver(type:string = 'default'): ResolveTypes {
        return {
            token: 'forProfile',
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
                await configService.ready;

                if (configService.get('$base.profile.type') === type) {
                    return Promise.resolve();
                } else {
                    stateService.go('app.error', transition.params());
                    return Promise.reject();
                }
            },
        };
    }
}

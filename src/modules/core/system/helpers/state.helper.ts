import {
    Transition,
    StateDeclaration,
    ResolveTypes,
    StateService,
} from '@uirouter/core';
import {LazyLoadResult} from '@uirouter/core/lib/state/interface';

// If you try to import everything from 'wlc-engine/modules/core' then the project failed loading
import {
    ConfigService,
    ModalService,
    InjectionService,
} from 'wlc-engine/modules/core/system/services';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {IRedirect, IIndexing} from 'wlc-engine/modules/core';

import _merge from 'lodash-es/merge';

export class StateHelper {
    public static async onStateEnter(trans: Transition) {
        const params = trans.params();
        const config = trans.injector().get(ConfigService);

        await config.ready;
        const redirects: IIndexing<IRedirect> = config.get('$base.redirects.states') || {};

        const locale = {
            locale: trans.injector().get('lang') || 'en',
        };

        const redirect = redirects[trans.to().name];

        if (redirect) {
            const redirectParams = _merge(locale, redirect.params);

            if (config.get('$base.profile.type') === redirect.profile || !redirect.profile) {
                trans.abort();
                trans.router.stateService.go(
                    redirect.state,
                    redirectParams,
                );
            }
        } else if (!params.locale) {
            trans.abort();
            trans.router.stateService.go(
                redirects['app.home']?.state || 'app.home',
                _merge(locale, redirects['app.home']?.params),
            );
        }
    }

    public static lazyLoadModules(modules: string[]): (transition: Transition, state: StateDeclaration) => Promise<LazyLoadResult> {
        return async ($transition) => {
            const configService: ConfigService = $transition.injector().get(ConfigService);
            await configService.ready;
            const injectionService: InjectionService = $transition.injector().get(InjectionService);
            await injectionService.importModules(modules);
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
                InjectionService,
                ModalService,
            ],
            resolveFn: async (
                configService: ConfigService,
                stateService: StateService,
                transition: Transition,
                injectionService: InjectionService,
                modalService: ModalService,
            ) => {
                const result = new Deferred();

                await configService.ready;

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
}

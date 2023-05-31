import {
    Transition,
    StateDeclaration,
    ResolveTypes,
    StateService,
} from '@uirouter/core';
import {first} from 'rxjs/operators';
import {LazyLoadResult} from '@uirouter/core/lib/state/interface';
import {Ng2StateDeclaration} from '@uirouter/angular';

import _merge from 'lodash-es/merge';

// If you try to import everything from 'wlc-engine/modules/core' then the project failed loading
import {
    ConfigService,
    ModalService,
    InjectionService,
} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {TranslateService} from '@ngx-translate/core';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {TModuleName} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';

export type TPageNameHandler = (transition: Transition) => string;

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
                return trans.router.stateService.target(
                    redirect.state,
                    redirectParams,
                );
            }
        } else if (!params.locale) {
            return trans.router.stateService.target(
                redirects['app.home']?.state || 'app.home',
                _merge(locale, redirects['app.home']?.params),
            );
        }
    }

    public static lazyLoadModules(
        modules: TModuleName[],
    ): (transition: Transition, state: StateDeclaration) => Promise<LazyLoadResult> {
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
                TranslateService,
            ],
            resolveFn: async (
                configService: ConfigService,
                stateService: StateService,
                transition: Transition,
                injectionService: InjectionService,
                modalService: ModalService,
                translateService: TranslateService,
            ) => {
                const result = new Deferred();

                translateService.stream('currentLang')
                    .pipe(first())
                    .subscribe(async () => {
                        await configService.ready;
                        const userService: UserService = await injectionService
                            .getService<UserService>('user.user-service');

                        if (userService.isAuthenticated) {
                            result.resolve();
                        } else {
                            result.reject();
                            await stateService.go('app.home', transition.params());
                            modalService.showModal('login');
                        }
                    });
                return result.promise;
            },
        };
    }

    /**
     * Reject opening profile state if it's disabled
     * @param configPath path to config which contains boolean value if current state is available
     * @returns ResolveTypes
     */
    public static profileStateResolver(configPath: string): ResolveTypes {
        return {
            token: 'stateAllowed',
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

                if (configService.get<boolean>(configPath)) {
                    result.resolve();
                } else {
                    result.reject();
                    stateService.go('app.error', transition.params());
                }
                return result.promise;
            },
        };
    }

    /**
     * Return open modal resolver
     *
     * @param modalId {string} - id of modal
     * @returns {ResolveTypes}
     */
    public static openModalResolver(modalId: string): ResolveTypes {
        return {
            token: `openModal_${modalId}`,
            deps: [
                Transition,
                StateService,
                ModalService,
                InjectionService,
            ],
            async resolveFn(
                transition: Transition,
                stateService: StateService,
                modalService: ModalService,
                injectionService: InjectionService,
            ) {
                const userService: UserService = await injectionService.getService<UserService>('user.user-service');

                if (userService.isAuthenticated) {
                    setTimeout(() => {
                        stateService.go('app.home');
                    });
                    return;
                }

                setTimeout(async () => {
                    await stateService.go('app.home', transition.params());
                    modalService.showModal(modalId);
                });
            },
        };
    }

    public static goToErrorPage(trans: Transition): void {
        trans.abort();
        const {locale} = trans.params();
        trans.router.stateService.go('app.error', {
            locale: locale || trans.injector().get('lang') || 'en',
        });
    }

    /**
     * Save some key with value to state "data"
     *
     * @param state State declaration
     * @param param Name of key
     * @param value Value
     */
    public static setStateData<T>(state: Ng2StateDeclaration, param: string, value: T) {
        if (!state.data) {
            state.data = {};
        }
        state.data[param] = value;
    }

    public static pageNameResolver = (pageNameHandler: TPageNameHandler) => {
        return {
            token: 'pageName',
            deps: [
                StateService,
                Transition,
            ],
            resolveFn: async (
                stateService: StateService,
                transition: Transition,
            ) => {
                const result = new Deferred();
                result.resolve(transition.params()?.category);

                const state: Ng2StateDeclaration = transition.targetState().state();
                if (!state.data) {
                    state.data = {};
                }

                state.data.pageName = pageNameHandler(transition);

                return result.promise;
            },
        };
    };
}

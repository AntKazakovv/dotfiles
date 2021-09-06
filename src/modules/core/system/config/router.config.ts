import {Injector} from '@angular/core';
import {
    Transition,
    UIRouter,
} from '@uirouter/core';
import {
    IRedirect,
    IIndexing,
    ConfigService,
    profileRedirectType,
    EventService,
    StateHistoryService,
    IStateModalOption,
} from 'wlc-engine/modules/core';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';
import _isNil from 'lodash-es/isNil';

export function routerConfigFn(router: UIRouter, injector: Injector) {
    const configService: ConfigService = injector.get(ConfigService);
    const eventService: EventService = injector.get(EventService);
    const stateHistoryService: StateHistoryService = injector.get(StateHistoryService);

    configService.ready.then(() => {
        const lang = configService.get<string>('appConfig.language') || 'en';
        const profileType = configService.get<profileRedirectType>('$base.profile.type');
        const stateRedirects = configService.get<IIndexing<IRedirect>>('$base.redirects.states') || {};
        const profileRedirectsMap =
            configService.get<IIndexing<profileRedirectType>>('$base.redirects.profileRedirects');
        const criteria = ({name}): boolean => {
            return _includes(_keys(profileRedirectsMap), name);
        };
        const stateModals = configService.get<IIndexing<IStateModalOption>>('$modals.states');

        router.urlService.rules.initial({state: 'app.home', params: {locale: lang}});

        if (_keys(stateRedirects).length) {
            _each(stateRedirects, (redirect, state) => {
                if (profileType === redirect.profile || !redirect.profile) {
                    router.transitionService.onEnter({to: state}, (transition: Transition) => {
                        router.stateService.go(redirect.state, redirect?.params || transition.params());
                    });
                }
            });
        }

        router.transitionService.onBefore({to: criteria}, (trans) => {
            if (profileType !== profileRedirectsMap?.[trans.to().name]) {
                trans.abort();
                router.stateService.go('app.error', trans.params());
            }
        });

        router.transitionService.onExit({}, (trans, state) => {
            stateHistoryService.setFirstVisit(state.name);
        });

        // TODO: check state params, add subscribe for login/logout and more ...
        router.transitionService.onSuccess({}, (trans) => {
            _each(stateModals, (option, state) => {
                if (state !== trans.to().name) {
                    return;
                }
                const showModal: boolean[] = [];

                if (!_isNil(option.auth)) {
                    if (option.auth === 'any') {
                        showModal['auth'] = true;
                    } else{
                        showModal['auth'] = option.auth === configService.get<boolean>('$user.isAuthenticated');
                    }
                } else {
                    showModal['auth'] = false;
                }

                if (!_isNil(option.once)) {
                    if (option.once) {
                        showModal['once'] = option.once === stateHistoryService.checkFirstVisit(state);
                    } else {
                        showModal['once'] = true;
                    }
                } else {
                    showModal['once'] = false;
                }

                if (showModal['auth'] && showModal['once']) {
                    eventService.emit({
                        name: 'SHOW_MODAL',
                        data: option.modal,
                    });
                }
            });
        });
    });
}

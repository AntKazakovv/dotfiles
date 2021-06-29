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
} from 'wlc-engine/modules/core';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';

export function routerConfigFn(router: UIRouter, injector: Injector) {
    const configService: ConfigService = injector.get(ConfigService);

    configService.ready.then(() => {
        const lang = configService.get<string>('appConfig.language') || 'en';
        const profileType = configService.get<profileRedirectType>('$base.profile.type');
        const stateRedirects = configService.get<IIndexing<IRedirect>>('$base.redirects.states') || {};
        const profileRedirectsMap =
            configService.get<IIndexing<profileRedirectType>>('$base.redirects.profileRedirects');
        const criteria = ({name}): boolean => {
            return _includes(_keys(profileRedirectsMap), name);
        };

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
    });
}

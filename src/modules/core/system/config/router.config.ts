import {Injector} from '@angular/core';
import {Transition, UIRouter} from '@uirouter/core';
import {IRedirect, IIndexing} from 'wlc-engine/modules/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';
import _includes from 'lodash-es/includes';

// import { Visualizer } from '@uirouter/visualizer';

// import { googleAnalyticsHook } from './util/ga';
// import { requiresAuthHook } from './global/auth.hook';

export function routerConfigFn(router: UIRouter, injector: Injector) {
    const configService: ConfigService = injector.get(ConfigService);
    configService.ready.then(() => {
        const lang = configService.get<string>('appConfig.language') || 'en';
        router.urlService.rules.initial({state: 'app.home', params: {locale: lang}});

        const redirects = configService.get<IIndexing<IRedirect>>('$base.redirects.states') || {};
        if (_keys(redirects).length) {

            _each(redirects, (redirect, state) => {
                router.transitionService.onEnter({to: state}, (transition: Transition) => {
                    router.stateService.go(redirect.state, redirect?.params || transition.params());
                });
            });
        }

        const criteria = ({name}): boolean => {
            return _includes(_keys(profileRedirectsMap), name);
        };

        const profileRedirectsMap = configService.get('$base.redirects.profileRedirects');
        router.transitionService.onBefore({to: criteria}, (trans) => {
            if (configService.get('$base.profile.type') !== profileRedirectsMap?.[trans.to().name]) {
                trans.abort();
                router.stateService.go('app.error', trans.params());
            }
        });
    });


    // const transitionService = router.transitionService;
    // requiresAuthHook(transitionService);
    // googleAnalyticsHook(transitionService);

    // router.trace.enable(Category.TRANSITION);
    // router.plugin(Visualizer);
}

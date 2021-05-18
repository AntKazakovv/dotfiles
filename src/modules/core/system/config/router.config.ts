import {Injector} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services';
// import { Visualizer } from '@uirouter/visualizer';

// import { googleAnalyticsHook } from './util/ga';
// import { requiresAuthHook } from './global/auth.hook';

export function routerConfigFn(router: UIRouter, injector: Injector) {

    const configService: ConfigService = injector.get(ConfigService);
    configService.ready.then(() => {
        const lang = configService.get<string>('appConfig.language') || 'en';
        router.urlService.rules.initial({state: 'app.home', params: {locale: lang}});
    });


    // const transitionService = router.transitionService;
    // requiresAuthHook(transitionService);
    // googleAnalyticsHook(transitionService);

    // router.trace.enable(Category.TRANSITION);
    // router.plugin(Visualizer);
}

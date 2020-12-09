import { UIRouter, Category } from '@uirouter/core';
// import { Visualizer } from '@uirouter/visualizer';

// import { googleAnalyticsHook } from './util/ga';
// import { requiresAuthHook } from './global/auth.hook';

export function routerConfigFn(router: UIRouter) {
  router.urlService.rules.initial({state: 'app.home', params: {locale: 'en'}});
  // const transitionService = router.transitionService;
  // requiresAuthHook(transitionService);
  // googleAnalyticsHook(transitionService);

  // router.trace.enable(Category.TRANSITION);
  // router.plugin(Visualizer);
}

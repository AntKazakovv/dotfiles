import {Transition, StateDeclaration} from '@uirouter/core';
import {ConfigService, LayoutService} from 'wlc-engine/modules/core/system/services';
import {LazyLoadResult} from '@uirouter/core/lib/state/interface';

export class StateHelper {
    public static onStateEnter(trans: Transition, state: StateDeclaration) {
        const params = trans.params();
        if (!params.locale) {
            trans.abort();
            trans.router.stateService.go('app.home', {locale: trans.injector().get('lang') || 'en'});
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
}

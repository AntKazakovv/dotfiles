import {Transition, StateDeclaration} from '@uirouter/core';

export class StateHelper {
    public static onStateEnter(trans: Transition, state: StateDeclaration) {
        const params = trans.params();
        if (!params.locale) {
            trans.abort();
            trans.router.stateService.go('app.home', {locale: 'en'});
        }
    }
}

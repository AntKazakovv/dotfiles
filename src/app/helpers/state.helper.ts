import {StateDeclaration, Transition} from '@uirouter/core';

export class StateHelper {
    public static onEnterFunc(trans: Transition, state: StateDeclaration) {
        const params = trans.params();
        if (!params.locale) {
            trans.abort();
            trans.router.stateService.go('app', {locale: 'en'});
        }
    }
}

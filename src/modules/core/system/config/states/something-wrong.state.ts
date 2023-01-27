import {
    Ng2StateDeclaration,
    Transition,
    StateService,
} from '@uirouter/angular';

export const somethingWrongState: Ng2StateDeclaration = {
    url: '/something-wrong',
    resolve: [
        {
            token: 'redirectAfterLoad',
            deps: [
                Transition,
                StateService,
            ],
            resolveFn: (
                transition: Transition,
                stateService: StateService,
            ): void => {

                if (!transition.$from().name) {
                    transition.abort();
                    stateService.go('app.home', transition.params());
                }
            },
        },
    ],
};

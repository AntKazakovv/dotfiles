'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {startGameResolver} from 'wlc-engine/modules/core/system/config/resolvers';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {ModalService} from 'wlc-engine/modules/core/system/services';

export const gamePlayState: Ng2StateDeclaration = {
    url: '/play/:merchantId/:launchCode?:demo',
    resolve: [
        startGameResolver,
    ],
    lazyLoad: StateHelper.lazyLoadModules(['games', 'finances']),
    onEnter: ($transition) => {
        const modalService: ModalService = $transition.injector().get(ModalService);
        modalService.closeAllModals();
    },
};

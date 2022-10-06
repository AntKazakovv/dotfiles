'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {startGameResolver} from 'wlc-engine/modules/core/system/config/resolvers';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {GamesFilterService} from 'wlc-engine/modules/games';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

export const gamePlayState: Ng2StateDeclaration = {
    url: '/play/:merchantId/:launchCode?:demo',
    resolve: [
        startGameResolver,
    ],
    lazyLoad: StateHelper.lazyLoadModules(['games']),
    onEnter: ($transition) => {
        const modalService: ModalService = $transition.injector().get(ModalService);
        modalService.closeAllModals();

        GlobalHelper.appUnlockScreenOrientation();
    },
    onExit: ($transition) => {
        const gamesFilterService: GamesFilterService = $transition.injector().get(GamesFilterService);

        if ($transition.from().name === 'app.gameplay' && $transition.to().name === 'app.gameplay') {
            gamesFilterService.toClearCache$.next(false);
            return;
        }

        gamesFilterService.toClearCache$.next(true);

        GlobalHelper.appLockScreenOrientation('portrait');
    },
};

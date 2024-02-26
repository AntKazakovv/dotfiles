import {Ng2StateDeclaration} from '@uirouter/angular';

import {startGameResolver} from 'wlc-engine/modules/core/system/config/resolvers';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    GamesFilterService,
    TScreenOrientation,
} from 'wlc-engine/modules/games';

export const gamePlayState: Ng2StateDeclaration = {
    url: '/play/:merchantId/:launchCode?:demo',
    resolve: [
        startGameResolver,
    ],
    lazyLoad: StateHelper.lazyLoadModules(['games']),
    onEnter: async ($transition) => {
        const configService: ConfigService = $transition.injector().get(ConfigService);
        const modalService: ModalService = $transition.injector().get(ModalService);

        modalService.closeAllModals();

        const merchantId: string = $transition.router.globals.params['merchantId'];
        const screenOrientation: TScreenOrientation =
            configService.get(`$games.mobile.screenOrientation.${merchantId}`);

        if (screenOrientation) {
            GlobalHelper.appLockScreenOrientation(screenOrientation);
        } else {
            GlobalHelper.appUnlockScreenOrientation();
        }
    },
    onExit: ($transition) => {
        GlobalHelper.appLockScreenOrientation('portrait');

        const gamesFilterService: GamesFilterService = $transition.injector().get(GamesFilterService);

        if ($transition.from().name === 'app.gameplay' && $transition.to().name === 'app.gameplay') {
            gamesFilterService.toClearCache$.next(false);
            return;
        }
        gamesFilterService.toClearCache$.next(true);
    },
};

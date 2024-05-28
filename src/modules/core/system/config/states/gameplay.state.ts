import {
    Ng2StateDeclaration,
} from '@uirouter/angular';

import _toNumber from 'lodash-es/toNumber';

import {startGameResolver} from 'wlc-engine/modules/core/system/config/resolvers';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {StateHistoryService} from 'wlc-engine/modules/core/system/services/state-history/state-history.service';
import {
    GamesFilterService,
    TScreenOrientation,
    GamesCatalogService,
} from 'wlc-engine/modules/games';

import {
    dontShowRecommendedGames,
    dontShowRecommendedGamesStorage,
} from 'wlc-engine/modules/games/system/constants/recommended-games.constants';

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
    onExit: async ($transition) => {
        const configService: ConfigService = $transition.injector().get(ConfigService);
        const gamesCatalogService: GamesCatalogService = $transition.injector().get(GamesCatalogService);
        const stateHistoryService: StateHistoryService = $transition.injector().get(StateHistoryService);
        const showRecommendedGames = !configService.get<boolean>({
            name: dontShowRecommendedGames,
            storageType: dontShowRecommendedGamesStorage,
        });

        GlobalHelper.appLockScreenOrientation('portrait');

        if (configService.get('$games.categories.useRecommended')
            && showRecommendedGames
            && configService.get('$user.isAuthenticated')
            && $transition.$to().name !== 'app.profile.cash.deposit'
            && $transition.$to().name !== 'app.gameplay'
        ) {

            const {launchCode, merchantId} = stateHistoryService.getCurrentState().params;
            gamesCatalogService.showRecommendedGamesModal(_toNumber(merchantId), launchCode);
        }

        const gamesFilterService: GamesFilterService = $transition.injector().get(GamesFilterService);

        if ($transition.from().name === 'app.gameplay' && $transition.to().name === 'app.gameplay') {
            gamesFilterService.toClearCache$.next(false);
            return;
        }
        gamesFilterService.toClearCache$.next(true);
    },
};

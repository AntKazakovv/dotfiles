'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {TranslateService} from '@ngx-translate/core';
import {
    StateService,
    Transition,
} from '@uirouter/core';

import _toNumber from 'lodash-es/toNumber';

import {
    InjectionService,
} from 'wlc-engine/modules/core';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

export const runGameState: Ng2StateDeclaration = {
    url: '/run-game/:merchantId/:launchCode',
    resolve: [
        {
            token: 'gameName',
            deps: [
                StateService,
                InjectionService,
                TranslateService,
                Transition,
            ],
            resolveFn: async (
                stateService: StateService,
                injectionService: InjectionService,
                translateService: TranslateService,
                transition: Transition,
            ) => {
                const gamesCatalogService = await injectionService
                    .getService<GamesCatalogService>('games.games-catalog-service');

                await gamesCatalogService.ready;

                const game = gamesCatalogService.getGame(
                    _toNumber(transition.targetState().params().merchantId),
                    transition.targetState().params().launchCode,
                );

                if (game) {
                    const state: Ng2StateDeclaration = transition.targetState().state();
                    StateHelper.setStateData(state, 'gameName',
                        game.name[translateService.currentLang] || game.name['en']);
                }
            },
        },
    ],
};

'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {
    StateService,
    Transition,
} from '@uirouter/core';

import {
    InjectionService,
} from 'wlc-engine/modules/core';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

const providerResolver = {
    token: 'providerName',
    deps: [
        StateService,
        InjectionService,
        Transition,
    ],
    resolveFn: async (
        stateService: StateService,
        injectionService: InjectionService,
        transition: Transition,
    ) => {
        const gamesCatalogService = await injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');

        await gamesCatalogService.ready;

        const merchant = gamesCatalogService.getMerchantByName(transition.targetState().params().provider);

        if (merchant) {
            const state: Ng2StateDeclaration = transition.targetState().state();
            StateHelper.setStateData(state, 'providerName', merchant.name);
        }
    },
};

export const providersState: Ng2StateDeclaration = {
    url: '/providers',
};

export const providersItemState: Ng2StateDeclaration = {
    url: '/:provider',
    resolve: [
        providerResolver,
    ],
};

export const providersItemCategoryState: Ng2StateDeclaration = {
    url: '/:category/:childCategory',
    resolve: [
        providerResolver,
    ],
    params: {
        childCategory: {
            value: '',
            squash: true,
            inherit: false,
        },
    },
};

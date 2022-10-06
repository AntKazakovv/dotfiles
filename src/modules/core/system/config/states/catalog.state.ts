'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {
    Transition,
} from '@uirouter/core';

import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
    onEnter: async (trans: Transition) => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        const gamesCatalogService: GamesCatalogService = await injectionService
            .getService('games.games-catalog-service');
        const categorySlug: string = trans.params().category;

        await gamesCatalogService.ready;

        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);
        if (!category?.isParent) {
            StateHelper.goToErrorPage(trans);
        }
    },
};

export const catalogChildState: Ng2StateDeclaration = {
    url: '/:childCategory',
    onEnter: async (trans: Transition) => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        const gamesCatalogService: GamesCatalogService = await injectionService
            .getService('games.games-catalog-service');
        const categorySlug: string = trans.params().childCategory;
        await gamesCatalogService.ready;
        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);

        if (!category?.parentCategory) {
            StateHelper.goToErrorPage(trans);
        }
    },
};

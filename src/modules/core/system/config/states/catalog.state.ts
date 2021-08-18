'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {
    CategoryModel,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    InjectionService,
} from 'wlc-engine/modules/core';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
    onEnter: async (trans) => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        const gamesCatalogService: GamesCatalogService = await injectionService.getService('games.games-catalog-service');
        const categorySlug: string = trans.params().category;

        await gamesCatalogService.ready;

        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);
        if (!category || !category.isParent) {
            trans.abort();
            const {locale} = trans.params();
            trans.router.stateService.go('app.error', {
                locale: locale || trans.injector().get('lang') || 'en',
            });
        }
    },
};

export const catalogChildState: Ng2StateDeclaration = {
    url: '/:childCategory',
};

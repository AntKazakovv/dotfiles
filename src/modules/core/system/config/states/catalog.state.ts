'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {GamesCatalogService} from 'wlc-engine/modules/games';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
    onEnter: async (trans) => {
        const gamesCatalogService = trans.injector().get(GamesCatalogService);
        const categorySlug = trans.params().category;
        await gamesCatalogService.ready;

        if (!gamesCatalogService.getCategoryBySlug(categorySlug)) {
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

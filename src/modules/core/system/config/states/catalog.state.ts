'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
    onEnter: async (trans) => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        const configService = trans.injector().get(ConfigService);

        const gamesCatalogService: GamesCatalogService = await injectionService
            .getService('games.games-catalog-service');
        const categorySlug: string = trans.params().category;

        await gamesCatalogService.ready;

        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);
        const authCheckFailed: boolean = category
            && category.authRequired
            && !configService.get('$user.isAuthenticated');

        if (!category || !category.isParent || authCheckFailed) {
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

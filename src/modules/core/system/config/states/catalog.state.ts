'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {TranslateService} from '@ngx-translate/core';
import {
    Transition,
} from '@uirouter/core';

import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const catalogState: Ng2StateDeclaration = {
    url: '/catalog/:category',
    onEnter: async (transition: Transition) => {
        const injectionService: InjectionService = transition.injector().get(InjectionService);
        const gamesCatalogService: GamesCatalogService = await injectionService
            .getService('games.games-catalog-service');
        const categorySlug: string = transition.params().category;

        await gamesCatalogService.ready;

        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);
        if (!category?.isParent) {
            StateHelper.goToErrorPage(transition);
            return;
        }

        const state: Ng2StateDeclaration = transition.targetState().state();
        const translateService: TranslateService = transition.injector().get(TranslateService);

        StateHelper.setStateData(state, 'categoryName',
            category.title[translateService.currentLang] || category.title['en']);
    },
};

export const catalogChildState: Ng2StateDeclaration = {
    url: '/:childCategory',
    onEnter: async (transition: Transition) => {
        const injectionService: InjectionService = transition.injector().get(InjectionService);
        const gamesCatalogService: GamesCatalogService = await injectionService
            .getService('games.games-catalog-service');
        const categorySlug: string = transition.params().childCategory;

        await gamesCatalogService.ready;

        const category: CategoryModel = gamesCatalogService.getCategoryBySlug(categorySlug);
        if (!category?.parentCategory) {
            StateHelper.goToErrorPage(transition);
            return;
        }

        const state: Ng2StateDeclaration = transition.targetState().state();
        const translateService: TranslateService = transition.injector().get(TranslateService);
        StateHelper.setStateData(state, 'categoryName',
            category.title[translateService.currentLang] || category.title['en']);
    },
};

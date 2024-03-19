'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {StoreService} from 'wlc-engine/modules/store/system/services/store/store.service';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category.model';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers';

export const profileStoreState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-store',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.store.use'),
    ],
};

export const profileStoreMain: Ng2StateDeclaration = {
    url: '?category',
    onEnter: async (transition: Transition) => {
        const injectionService: InjectionService = transition.injector().get(InjectionService);
        const storeService: StoreService = await injectionService.getService('store.store-service');
        const category: StoreCategory = await storeService.getCategoryByState(transition);

        if (transition.params().category && !category) {
            transition.abort();
            const {locale} = transition.params();
            transition.router.stateService.go('app.profile.loyalty-store.main', {
                locale: locale || transition.injector().get('lang') || 'en',
                category: undefined,
            });
        }
    },
};

export const profileStoreOrders: Ng2StateDeclaration = {
    url: '/orders',
};

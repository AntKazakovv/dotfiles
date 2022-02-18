'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Transition} from '@uirouter/core';

import {StoreService} from 'wlc-engine/modules/store/system/services/store/store.service';
import {StoreCategory} from 'wlc-engine/modules/store/system/models/store-category';

export const profileStoreState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-store',
};

export const profileStoreMain: Ng2StateDeclaration = {
    url: '?category',
    onEnter: async (transition: Transition) => {
        const storeService: StoreService = transition.injector().get(StoreService);
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

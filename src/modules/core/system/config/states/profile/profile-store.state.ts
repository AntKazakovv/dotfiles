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
        if (transition.params().category) {
            const injectionService: InjectionService = transition.injector().get(InjectionService);
            const storeService: StoreService = await injectionService.getService('store.store-service');
            const category: StoreCategory = await storeService.getCategoryByState(transition);

            if (!category) {
                transition.abort();
                const locale = transition.params().locale || transition.injector().get('lang') || 'en';
                transition.router.stateService.go('app.profile.loyalty-store.main', {
                    locale,
                    category: undefined,
                });
            }
        }
    },
};

export const profileStoreOrders: Ng2StateDeclaration = {
    url: '/orders',
};

export const profileStoreOrdersHistory: Ng2StateDeclaration = {
    url: '/orders/history',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.store.use'),
    ],
};

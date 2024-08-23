'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

import {StateHelper} from 'wlc-engine/modules/core/system/helpers';

export const profileBonusesState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-bonuses',
};

export const profileBonusesMainState: Ng2StateDeclaration = {
    url: '',
};

export const profileBonusesOffersState: Ng2StateDeclaration = {
    url: '/offers',
};

export const profileBonusesActiveState: Ng2StateDeclaration = {
    url: '/active',
};

export const profileBonusesAllState: Ng2StateDeclaration = {
    url: '/all',
};

export const profileBonusesInventoryState: Ng2StateDeclaration = {
    url: '/inventory',
    resolve: [
        StateHelper.profileStateResolver('$base.profile.bonuses.inventory.use'),
    ],
};

export const profileBonusesHistoryState: Ng2StateDeclaration = {
    url: '/history',
};

export const profileBonusesPromoState: Ng2StateDeclaration = {
    url: '/promo',
};

export const profileBonusesSystemState: Ng2StateDeclaration = {
    url: '/system',
};

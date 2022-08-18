'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';

export const profileBonusesState: Ng2StateDeclaration = {
    abstract: true,
    url: '/loyalty-bonuses',
};

export const profileBonusesMainState: Ng2StateDeclaration = {
    url: '',
};

export const profileBonusesActiveState: Ng2StateDeclaration = {
    url: '/active',
};

export const profileBonusesAllState: Ng2StateDeclaration = {
    url: '/all',
};

export const profileBonusesInventoryState: Ng2StateDeclaration = {
    url: '/inventory',
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

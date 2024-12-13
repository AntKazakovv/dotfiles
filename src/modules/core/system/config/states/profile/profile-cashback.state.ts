import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const profileCashbackState: Ng2StateDeclaration = {
    url: '/cashback',
    resolve: [
        StateHelper.profileStateResolver('$base.cashbackReward.use'),
    ],
};

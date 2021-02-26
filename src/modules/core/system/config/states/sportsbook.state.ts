'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';

export const sportsbookState: Ng2StateDeclaration = {
    url: '/sportsbook/:page/:page2/:page3/:page4/:page5',
    params: {
        page: {
            value: '',
            squash: true,
        },
        page2: {
            value: '',
            squash: true,
        },
        page3: {
            value: '',
            squash: true,
        },
        page4: {
            value: '',
            squash: true,
        },
        page5: {
            value: '',
            squash: true,
        },
    },
    lazyLoad: StateHelper.lazyLoadModules(['games']),
};

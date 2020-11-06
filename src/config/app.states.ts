import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from './state.helper';

import {AppComponent} from 'wlc-engine/app/app.component';
import {ConfigService} from 'wlc-engine/modules/core/services';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';


import {
    map as _map,
} from 'lodash';

const states = {
    'app.home': {
        url: '',
    },
    'app.catalog': {
        url: '/catalog/:category',
        params: {
            category: 'test',
        },
    },
    'app.pages': {
        url: '/pages/:slug',
    },
};

const appState: Ng2StateDeclaration = {
    name: 'app',
    url: '/:locale',
    redirectTo: 'app.home',
    onEnter: StateHelper.onStateEnter,
    component: AppComponent,
    resolve: [
        {
            token: 'lang',
            deps: [ConfigService],
            resolveFn: async (config: ConfigService) => {
                await config.ready;
                return config.get<string>('appConfig.language');
            },
        },
    ],
};

export const APP_STATES: Ng2StateDeclaration[] = [
    appState,
    ..._map(states, (state, key) => {
        return {
            name: key,
            component: LayoutComponent,
            ...state,
        };
    }),
];

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from './state.helper';

import {AppComponent} from 'wlc-engine/app/app.component';
import {ConfigService} from 'wlc-engine/modules/core/services';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {
    homeState,
    catalogState,
    gamePlayState,
    pagesState,
    contactsState,
    profileState,
} from './states';

import {
    map as _map,
    values as _values,
    assign as _assign,
} from 'lodash';

const states = {
    'app.home': homeState,
    'app.catalog': catalogState,
    'app.gameplay': gamePlayState,
    'app.pages': pagesState,
    'app.contacts': contactsState,
    'app.profile': profileState,
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

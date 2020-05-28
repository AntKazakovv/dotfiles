import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from './state.helper';

import {AppComponent} from '../modules/base/app/app.component';
import {ConfigService} from '../modules/core/services';

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
                return config.get('language');
            }
        }
    ]
};

const homeState: Ng2StateDeclaration = {
    name: 'app.home.**',
    loadChildren: () => import('../modules/base/home/home.module').then(m => m.HomeModule)
};

const catalogState: Ng2StateDeclaration = {
    name: 'app.catalog.**',
    url: '/catalog',
    loadChildren: () => import('../modules/base/catalog/catalog.module').then(m => m.CatalogModule)
};

export const APP_STATES: Ng2StateDeclaration[] = [
    appState,
    homeState,
    catalogState,
];

import {Ng2StateDeclaration} from '@uirouter/angular';
import {StateHelper} from './state.helper';

import {AppComponent} from '../modules/base/app/app.component';
import {HomeComponent} from '../modules/base/home/home.component';

const appState: Ng2StateDeclaration = {
    name: 'app',
    url: '/:locale',
    redirectTo: 'app.home',
    onEnter: StateHelper.onStateEnter,
    component: AppComponent,
};

const homeState: Ng2StateDeclaration = {
    name: 'app.home.**',
    component: HomeComponent,
    // loadChildren: () => import('../modules/base/home/home.module').then(m => m.HomeModule)
};

export const APP_STATES: Ng2StateDeclaration[] = [
    appState,
    homeState,
];

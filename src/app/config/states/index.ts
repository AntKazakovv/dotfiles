import {Ng2StateDeclaration} from '@uirouter/angular';
import {AppLayoutComponent} from 'modules/pages/layouts/app-layout/app-layout.component';
import {StateHelper} from 'helpers';

import {homeState} from './home.state';

export const appState: Ng2StateDeclaration = {
    name: 'app',
    url: '/:locale',
    redirectTo: 'app.home',
    component: AppLayoutComponent,
    onEnter: StateHelper.onEnterFunc,
};

export const APP_STATES = [
    appState,
    homeState
];

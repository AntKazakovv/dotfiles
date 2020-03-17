import {Ng2StateDeclaration} from '@uirouter/angular';
import {AppComponent} from '../../app.component';
import {StateHelper} from 'helpers';

import {homeState} from './home.state';

export const appState: Ng2StateDeclaration = {
    name: 'app',
    url: '/:locale',
    redirectTo: 'app.home',
    component: AppComponent,
    onEnter: StateHelper.onEnterFunc,
};

export const APP_STATES = [
    appState,
    homeState
];

'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {startGameResolver} from './start-game.resolver';

export const gamePlayState: Ng2StateDeclaration = {
    url: '/play/:merchantId/:launchCode?demo',
    resolve: [
        startGameResolver,
    ]
};

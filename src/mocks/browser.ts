import {setupWorker, rest} from 'msw';
import _get from 'lodash-es/get';
import _each from 'lodash-es/each';
import _keys from 'lodash-es/keys';

import {tournamentsHandler} from 'wlc-engine/mocks/handlers/tournaments';
import {winsHandler} from 'wlc-engine/mocks/handlers/wins';

import * as $config from 'wlc-config/index';

export interface IAutoMockConfig {
    use: boolean;
    handlers?: string[];
}

const requests = {
    '/api/v1/tournaments': tournamentsHandler,
    '/api/v1/wins': winsHandler,
};

const handlers = [];

_each(_get($config, '$base.autoMocks.handlers', _keys(requests)), (request: string): void => {
    if (requests[request]) {
        handlers.push(
            rest.get(request, requests[request]),
        );
    }
});

export const worker = setupWorker(...handlers);

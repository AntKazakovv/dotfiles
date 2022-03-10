'use strict';

import {
    Ng2StateDeclaration,
    Transition,
} from '@uirouter/angular';
import {
    IIndexing,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    SportsbookService,
    ISportsbookSettings,
} from 'wlc-engine/modules/sportsbook';

import _assign from 'lodash-es/assign';

const getCustomState = (sportsbookId: string): Ng2StateDeclaration => {
    return _assign({}, sportsbookState, {
        url: sportsbookState.url.replace('sportsbook', sportsbookId),
    });
};

const sportsbookIdByState: IIndexing<string> = {
    'app.betradar': 'betradar',
    'app.esport': 'esport',
    'app.digitain': 'digitain',
    'app.pinnacle': 'pinnacleSW',
    'app.bti': 'bti',
    'app.altenar': 'altenar',
    'app.tglab': 'tglab',
    'app.nova': 'nova',
};

export const sportsbookState: Ng2StateDeclaration = {
    url: '/sportsbook/:page/:page2/:page3/:page4/:page5/:page6/:page7',
    params: {
        page: {
            value: '',
            squash: true,
            inherit: false,
        },
        page2: {
            value: '',
            squash: true,
            inherit: false,
        },
        page3: {
            value: '',
            squash: true,
            inherit: false,
        },
        page4: {
            value: '',
            squash: true,
            inherit: false,
        },
        page5: {
            value: '',
            squash: true,
            inherit: false,
        },
        page6: {
            value: '',
            squash: true,
            inherit: false,
        },
        page7: {
            value: '',
            squash: true,
            inherit: false,
        },
    },
    onEnter: async (trans: Transition): Promise<void> => {
        const injectionService: InjectionService = trans.injector().get(InjectionService);
        injectionService.getService('sportsbook.sportsbook-service')
            .then((sportsbookService: SportsbookService): void => {

                sportsbookService.ready.then(() => {
                    const sportsbookId: string = sportsbookIdByState[trans.to().name];
                    if (sportsbookId) {
                        const settings: ISportsbookSettings = sportsbookService.getSportsbookSettings({
                            id: sportsbookId,
                        });

                        if (!settings) {
                            trans.abort();
                            trans.router.stateService.go('app.error', {
                                locale: trans.params().locale,
                            });
                        }
                    }
                });
            });
    },
};

export const betradarState: Ng2StateDeclaration = getCustomState('betradar');

export const digitainState: Ng2StateDeclaration = getCustomState('digitain');

export const pinnacleState: Ng2StateDeclaration = getCustomState('pinnacle');

export const altenarState: Ng2StateDeclaration = getCustomState('altenar');

export const tglabState: Ng2StateDeclaration = getCustomState('tglab');

export const btiState: Ng2StateDeclaration = getCustomState('bti');

export const esportState: Ng2StateDeclaration = getCustomState('esport');

export const novaState: Ng2StateDeclaration = getCustomState('nova');

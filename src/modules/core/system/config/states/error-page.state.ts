'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {Subscription, interval} from 'rxjs';
import {ConfigService, EventService, ModalService} from 'wlc-engine/modules/core';

let subs$: Subscription;
let timeoutId: ReturnType<typeof setTimeout>;

export const errorPageState: Ng2StateDeclaration = {
    url: '/error',
    onEnter: async (trans) => {
        const configService: ConfigService = trans.injector().get(ConfigService);
        const eventService: EventService = trans.injector().get(EventService);
        const modalService: ModalService = trans.injector().get(ModalService);
        await configService.ready;
        const timeout: number = configService.get<number>('$base.app.toHomeFromErrorTimeout');
        const setTimeoutFn = (): void => {
            trans.router.stateService.go('app.home');
        };
        let openModal$: Subscription;
        let delay: number = timeout;
        let allTime: number = 0;
        let openModalTime: number = 0;
        
        if (timeout) {
            timeoutId = setTimeout(setTimeoutFn, delay);
            subs$ = interval(1000).subscribe((): void => {
                allTime++;
            });

            subs$.add(eventService.subscribe([
                {name: modalService.events.MODAL_SHOWN},
                {name: 'PANEL_OPEN'},
            ], (): void => {
                clearTimeout(timeoutId);
                openModal$ = interval(1000).subscribe((): void => {
                    openModalTime++;
                });
            }));

            subs$.add(eventService.subscribe([
                {name: modalService.events.MODAL_HIDDEN},
                {name: 'PANEL_CLOSE'},
            ], (): void => {
                if (openModal$) {
                    openModal$.unsubscribe();
                    delay = timeout - ((allTime - openModalTime) * 1000);
                    timeoutId = setTimeout(setTimeoutFn, delay);
                }
            },
            ));
        }
    },
    onExit: (): void => {
        clearTimeout(timeoutId);
        subs$.unsubscribe();
    },
};

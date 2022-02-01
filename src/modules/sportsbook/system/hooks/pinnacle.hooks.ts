import {
    Subject,
    fromEvent,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractHook,
    HooksService,
} from 'wlc-engine/modules/core';

import _get from 'lodash-es/get';

export interface IPinnacleHooksParams {
    hooksService: HooksService,
    disableHooks: Subject<void>,
}

export class PinnacleHooks extends AbstractHook {

    constructor(
        protected params: IPinnacleHooksParams,
        protected window: Window,
    ) {
        super({
            hooksService: params.hooksService,
            disableHooks: params.disableHooks,
        });
        this.init();
    }

    protected init(): void {
        this.iframeMessages();
    }

    protected iframeMessages(): void {
        fromEvent(this.window, 'message').pipe(
            takeUntil(this.params.disableHooks),
        ).subscribe((event) => {
            if (_get(event, 'data.action') === 'OPEN_WINDOW') {
                const url: string = _get(event, 'data.url');
                if (url) {
                    this.window.open(url);
                }
            }
        });
    }
}

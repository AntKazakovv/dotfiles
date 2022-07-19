import {
    fromEvent,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _get from 'lodash-es/get';

import {
    AbstractHook,
} from 'wlc-engine/modules/core';
import {ISportsbookHook} from 'wlc-engine/modules/sportsbook/system/interfaces/sportsbook.interface';

export interface IPinnacleHooksParams extends ISportsbookHook {
    window: Window,
}

export class PinnacleHooks extends AbstractHook {

    constructor(
        protected params: IPinnacleHooksParams,
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
        fromEvent(this.params.window, 'message').pipe(
            takeUntil(this.params.disableHooks),
        ).subscribe((event) => {
            if (_get(event, 'data.action') === 'OPEN_WINDOW') {
                const url: string = _get(event, 'data.url');
                if (url) {
                    this.params.window.open(url);
                }
            }
        });
    }
}

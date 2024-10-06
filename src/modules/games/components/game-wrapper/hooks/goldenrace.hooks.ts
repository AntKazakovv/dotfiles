import {
    fromEvent,
    Subject,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _get from 'lodash-es/get';

import {
    AbstractHook,
    HooksService,
} from 'wlc-engine/modules/core';
import {
    gameWrapperHooks,
    IGameWrapperHookLaunchInfo,
} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.interfaces';

export interface IGoldenraceHooksParams {
    hooksService: HooksService;
    disableHooks: Subject<void>;
}

export class GoldenraceHooks extends AbstractHook {

    constructor (
        protected override params: IGoldenraceHooksParams,
        protected window: Window,
    ) {
        super({
            hooksService: params.hooksService,
            disableHooks: params.disableHooks,
        });
        this.init();
    }

    protected init(): void {
        this.setHook<IGameWrapperHookLaunchInfo>(gameWrapperHooks.launchInfo, this.launchInfoHook, this);
    }

    protected launchInfoHook(data: IGameWrapperHookLaunchInfo): IGameWrapperHookLaunchInfo {
        fromEvent(this.window, 'message')
            .pipe(takeUntil(this.params.disableHooks))
            .subscribe((event: MessageEvent) => {
                const height: string = _get(event, 'data.value');
                const action: string = _get(event, 'data.action');

                if (action === 'game.resize.height' && height) {
                    const iframe: HTMLIFrameElement =
                    this.window.document.querySelector('#egamings_container iframe') as HTMLIFrameElement;

                    if (iframe) {
                        iframe.setAttribute('height', height);
                    }
                }
            });
        return data;
    }
}

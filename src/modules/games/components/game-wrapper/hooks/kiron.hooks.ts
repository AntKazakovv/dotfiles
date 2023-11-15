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
    IGameWrapperHookIframeShown,
} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.component';

export interface IKironHooksParams {
    hooksService: HooksService;
    disableHooks: Subject<void>;
}

export class KironHooks extends AbstractHook {

    constructor (
        protected override params: IKironHooksParams,
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
        this.setHook<IGameWrapperHookIframeShown>(gameWrapperHooks.iframeShown, this.iframeShownHook, this);
    }

    protected launchInfoHook(data: IGameWrapperHookLaunchInfo): IGameWrapperHookLaunchInfo {
        fromEvent(this.window, 'message').pipe(
            takeUntil(this.params.disableHooks),
        ).subscribe((event: MessageEvent) => {
            const height: string = _get(event, 'data.height');
            if (height) {
                const iframe: HTMLIFrameElement =
                    this.window.document.querySelector('#egamings_container') as HTMLIFrameElement;

                if (iframe) {
                    iframe.setAttribute('height', height);
                }
            }
        });
        return data;
    }

    protected iframeShownHook(data: IGameWrapperHookIframeShown): IGameWrapperHookIframeShown {
        data.iframe.setAttribute('scrolling', 'auto');
        return data;
    }
}

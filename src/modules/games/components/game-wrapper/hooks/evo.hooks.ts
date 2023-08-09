import {Renderer2} from '@angular/core';
import {Subject} from 'rxjs';
import _includes from 'lodash-es/includes';

import {AbstractHook} from 'wlc-engine/modules/core/system/classes';
import {HooksService} from 'wlc-engine/modules/core/system/services';
import {
    gameWrapperHooks,
    IGameWrapperHookIframeShown,
} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.component';

export interface IEvoHooksParams {
    hooksService: HooksService;
    disableHooks: Subject<void>;
    window: Window;
    document: Document,
    renderer: Renderer2;
}

export class EvoGamesHooks extends AbstractHook {

    constructor(
        protected override params: IEvoHooksParams,
    ) {
        super({
            hooksService: params.hooksService,
            disableHooks: params.disableHooks,
        });
        this.init();
    }

    protected init(): void {
        this.setHook<IGameWrapperHookIframeShown>(gameWrapperHooks.iframeShown, this.iframeShownHook, this);
    }

    protected iframeShownHook(data: IGameWrapperHookIframeShown): IGameWrapperHookIframeShown {
        if (data.mobile) {
            data.iframe.setAttribute('scrolling', 'no');

            if (_includes(data.launchInfo.gameScript, 'window.PROMO_WIDGET_PARAMS')) {
                const promoParams: unknown[] = data.launchInfo.gameScript.match(/(window\.PROMO_WIDGET_PARAMS.*?})/gm);

                if (promoParams.length) {
                    try {
                        (new Function(promoParams[0] + ';window.PROMO_WIDGET_PARAMS.mobile = true')());

                        const {renderer, document, window} = this.params;

                        const target: HTMLElement | null = document.getElementById('game_container');

                        if (!target) {
                            return;
                        }

                        const script: HTMLScriptElement = renderer.createElement('script');
                        renderer.setAttribute(script, 'type', 'text/javascript');
                        renderer.setAttribute(
                            script, 'src', window['PROMO_WIDGET_PARAMS'].url + '/loader.js');
                        renderer.appendChild(target, script);
                    } catch (error) {
                        return;
                    }
                }
            }
        }
        return data;
    }
}

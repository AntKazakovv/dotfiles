import {Subject} from 'rxjs';
import {AbstractHook} from 'wlc-engine/modules/core/system/classes';
import {HooksService} from 'wlc-engine/modules/core/system/services';
import {
    gameWrapperHooks,
    IGameWrapperHookIframeShown,
} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.component';

export interface IBetGamesHooksParams {
    hooksService: HooksService;
    disableHooks: Subject<void>;
}

export class BetGamesHooks extends AbstractHook {

    constructor (
        protected override params: IBetGamesHooksParams,
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
            data.iframe.setAttribute('scrolling', 'auto');
        }
        return data;
    }
}

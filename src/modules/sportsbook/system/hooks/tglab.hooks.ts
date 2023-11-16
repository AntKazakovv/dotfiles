import {
    UIRouter,
} from '@uirouter/core';
import {
    interval,
    Subscription,
} from 'rxjs';

import {
    AbstractHook,
} from 'wlc-engine/modules/core';
import {
    gameWrapperHooks,
    IGameWrapperHookLaunchInfo,
} from 'wlc-engine/modules/games';
import {ISportsbookHook} from 'wlc-engine/modules/sportsbook/system/interfaces/sportsbook.interface';

export interface ITglabHooksParams extends ISportsbookHook {
    router: UIRouter;
    window: Window;
}

export class TglabHooks extends AbstractHook {

    protected initSubscription: Subscription;

    constructor(
        protected override params: ITglabHooksParams,
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
        const path = this.params.router.globals.current.name === 'app.tglab' ? 'tglab' : 'sportsbook';
        const lang = this.params.router.stateService.params?.locale || 'en';

        data.launchInfo.gameHtml = data.launchInfo.gameHtml.replace('<sb-web-launch',
            `<sb-web-launch initializible="true" pre-live-path="${lang}/${path}" live-path="${lang}/${path}/in-play/"`);

        this.initSubscription = interval(500).subscribe(() => {
            if (this.params.window['SB_LAUNCH_ACTIONS']) {
                this.initSubscription.unsubscribe();
                try {
                    this.params.window['SB_LAUNCH_ACTIONS'].destroy();
                } catch {}
                this.params.window['SB_LAUNCH_ACTIONS'].init();
            }
        });
        return data;
    }

    protected override onDisableHooks(): void {
        super.onDisableHooks();
        this.initSubscription.unsubscribe();
        if (this.params.window['SB_LAUNCH_ACTIONS']) {
            this.params.window['SB_LAUNCH_ACTIONS'].destroy();
        }
    }
}

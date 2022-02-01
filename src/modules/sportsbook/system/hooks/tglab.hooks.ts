import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import {
    Subject,
} from 'rxjs';
import {first} from 'rxjs/internal/operators';
import _includes from 'lodash-es/includes';

import {AbstractHook} from 'wlc-engine/modules/core/system/classes/abstract.hook';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {
    gameWrapperHooks,
    IGameWrapperHookLaunchInfo,
} from 'wlc-engine/modules/games';

export interface ITglabHooksParams {
    hooksService: HooksService;
    disableHooks: Subject<void>;
    router: UIRouter;
}

export class TglabHooks extends AbstractHook {

    protected inplayOpened: boolean = false;

    constructor(
        protected params: ITglabHooksParams,
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
        this.navigationHandler();
    }

    protected launchInfoHook(data: IGameWrapperHookLaunchInfo): IGameWrapperHookLaunchInfo {
        if (this.params.router.globals.current.name === 'app.tglab') {
            data.launchInfo.gameScript = data.launchInfo.gameScript.replace(/\/sportsbook/g,
                '/tglab');
        }
        return data;
    }

    protected navigationHandler(): void {
        const transitionUnsubscribe: Function = this.params.router.transitionService
            .onSuccess({}, (transition: Transition): void => {
                if (!this.window.externalSBPageSwitch) {
                    return;
                }

                if (_includes(['inplay', 'in-play'], transition.params().page) && !this.inplayOpened) {
                    this.inplayOpened = true;
                    this.window.externalSBPageSwitch(2);
                } else if (this.inplayOpened) {
                    this.inplayOpened = false;
                    this.window.externalSBPageSwitch(1);
                }

            });

        this.params.disableHooks.pipe(first()).subscribe(() => {
            transitionUnsubscribe();
        });
    }
}

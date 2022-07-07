import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import {first} from 'rxjs/operators';
import _includes from 'lodash-es/includes';

import {AbstractHook} from 'wlc-engine/modules/core/system/classes/abstract.hook';
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

    protected inplayOpened: boolean = false;

    constructor(
        protected params: ITglabHooksParams,
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
                if (!this.params.window.externalSBPageSwitch) {
                    return;
                }

                if (_includes(['inplay', 'in-play'], transition.params().page) && !this.inplayOpened) {
                    this.inplayOpened = true;
                    this.params.window.externalSBPageSwitch(2);
                } else if (this.inplayOpened) {
                    this.inplayOpened = false;
                    this.params.window.externalSBPageSwitch(1);
                }

            });

        this.params.disableHooks.pipe(first()).subscribe(() => {
            transitionUnsubscribe();
        });
    }
}

import {UIRouter} from '@uirouter/core';
import {Subject} from 'rxjs';
import {
    AbstractHook,
    HooksService,
} from 'wlc-engine/modules/core';
import {
    gameWrapperHooks,
    IGameWrapperHookLaunchInfo,
} from 'wlc-engine/modules/games';

import _includes from 'lodash-es/includes';

export interface IDigitainHooksParams {
    hooksService: HooksService,
    disableHooks: Subject<void>,
    router: UIRouter,
}

export class DigitainHooks extends AbstractHook {

    constructor(
        protected params: IDigitainHooksParams,
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
        const pages = {
            home: 'Home',
            upcoming: 'Upcoming',
            eventView: 'EventView',
            results: 'Results',
            betsHistory: 'BetsHistory',
            upcomingDetails: 'UpcomingDetails',
            calendar: 'Calendar',
            multiView: 'MultiView',
            overview: 'Overview',
            schedule: 'Shedule',
        };
        const pageCode: string = pages[this.params.router.stateService.params.page] || pages.home;

        let eventId: string = '';
        if (_includes(['EventView', 'Upcoming', 'MultiView'], pageCode)
            && this.params.router.stateService.params.page2) {
            eventId = `_sp.push(['eventId', ${this.params.router.stateService.params.page2}])`;
        }

        data.launchInfo.gameScript = data.launchInfo.gameScript.replace('SportFrame.frame',
            `_sp.push(["currentPage", "${pageCode}"]); ${eventId} SportFrame.frame`);
        return data;
    }
}

import {UIRouter} from '@uirouter/core';

import _includes from 'lodash-es/includes';
import _merge from 'lodash-es/merge';
import _lowerFirst from 'lodash-es/lowerFirst';

import {
    AbstractHook,
    IIndexing,
} from 'wlc-engine/modules/core';
import {
    gameWrapperHooks,
    IGameWrapperHookLaunchInfo,
} from 'wlc-engine/modules/games';
import {ISportsbookHook} from 'wlc-engine/modules/sportsbook/system/interfaces/sportsbook.interface';

export interface IDigitainHooksParams extends ISportsbookHook {
    router: UIRouter,
    window: Window,
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
        this.initIframeNavigateHandler();
        this.initNavigation(data);

        return data;
    }

    /**
     * Init digitain navigation
     *
     * @param {IGameWrapperHookLaunchInfo} data Info about launch game
     */
    protected initNavigation(data: IGameWrapperHookLaunchInfo): void {
        const pages = {
            home: 'Home',
            upcoming: 'Upcoming',
            eventView: 'EventView',
            results: 'Results',
            betsHistory: 'BetsHistory',
            upcomingDetails: 'UpcomingDetails',
            gameDetails: 'EventView',
            calendar: 'Calendar',
            multiView: 'MultiView',
            overview: 'Overview',
            schedule: 'Shedule',
        };
        const pageCode: string = pages[this.params.router.stateService.params.page] || pages.home;

        let eventId: string = '';

        if (_includes(['EventView', 'Upcoming', 'MultiView'], pageCode)
            && this.params.router.stateService.params.page2) {
            eventId = `_sp.push(['eventId', '${this.params.router.stateService.params.page2}']);`;
        }

        data.launchInfo.gameScript = data.launchInfo.gameScript.replace('SportFrame.frame',
            `
            _sp.push(["onNavigateCallback", digitainOnNavigate]);
            _sp.push(["currentPage", "${pageCode}"]); ${eventId} SportFrame.frame
        `);
    }

    /**
     * Callback that was triggered after changing navigation inside sportsbook iframe
     */
    protected initIframeNavigateHandler(): void {
        if (!this.params.window.digitainOnNavigate) {
            this.params.window.digitainOnNavigate = (event: IDigitainNavigateEvent): void => {
                const stateParams: IIndexing<string | number> = {
                    page: _lowerFirst(event.pageName || ''),
                    page2: event.targetId || '',
                };
                _merge(this.params.router.globals.params, stateParams);

                const stateName: string = this.params.router.globals.current.name;
                const urlEvent: string = this.params.router.stateService.href(stateName, stateParams);

                history.replaceState(null, null, urlEvent);
            };
        }
    }
}

import {UIRouter} from '@uirouter/core';

import _get from 'lodash-es/get';
import _forEach from 'lodash-es/forEach';
import _trim from 'lodash-es/trim';
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

type IntegrationMode = 'mobile' | 'desktop';

export interface IDigitainHooksParams extends ISportsbookHook {
    router: UIRouter,
    window: Window,
}

export class DigitainHooks extends AbstractHook {

    protected integrationMode: IntegrationMode;

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
        this.integrationMode = _includes(data.launchInfo.gameScript, 'SportFrame.frame') ? 'desktop' : 'mobile';

        if (this.integrationMode === 'desktop' && !_includes(data.launchInfo.gameScript, 'fixedHeight')) {
            data.launchInfo.gameScript = data.launchInfo.gameScript.replace('SportFrame.frame',
                '_sp.push(["fixedHeight", true]); SportFrame.frame');
        }

        this.initNavigation(data);

        if (this.integrationMode === 'mobile') {
            this.initMobileDigitainHandlers();
        } else {
            this.initDesktopDigitainHandlers();
        }
        return data;
    }

    /**
     * Init digitain navigation
     *
     * @param {IGameWrapperHookLaunchInfo} data Info about launch game
     */
    protected initNavigation(data: IGameWrapperHookLaunchInfo): void {
        const pages: IIndexing<string> = {
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

        if (this.integrationMode === 'desktop') {
            data.launchInfo.gameScript = data.launchInfo.gameScript.replace('SportFrame.frame',
                `
                _sp.push(["onNavigateCallback", digitainOnNavigate]);
                _sp.push(["currentPage", "${pageCode}"]); ${eventId} SportFrame.frame
            `);
        } else {
            data.launchInfo.gameScript = data.launchInfo.gameScript.replace(/Bootstrapper.bootIframe\(.*?\)/,
                '$&.then(initDigitainApp)');
        }
    }

    /**
     * Init desktop digitain handlers
     */
    protected initDesktopDigitainHandlers(): void {
        if (!this.params.window.digitainOnNavigate) {

            this.params.window.digitainOnNavigate = (event: IDigitainNavigateEvent): void => {
                const stateParams: IIndexing<string | number> = {
                    page: _lowerFirst(event.pageName || ''),
                    page2: event.targetId || '',
                };
                this.replaceState(stateParams);
            };
        }
    }

    /**
     * Init mobile digitain handlers
     */
    protected initMobileDigitainHandlers(): void {
        if (!this.params.window.initDigitainApp) {

            this.params.window.initDigitainApp = (app: IMobileDigitainApp): void => {

                const pageUrl = location.pathname.replace(/.*\/digitain|sportsbook\//, '');

                if (pageUrl) {
                    app.navigateTo(pageUrl);
                }

                app.addEventListener('onNavigate', (event): void => {
                    const pathInfo = _get(event, 'data.location.pathname');

                    if (pathInfo) {
                        const pageUrl: string = _trim(pathInfo, '/');
                        const pathData: string[] = pageUrl.split('/');
                        const stateParams: IIndexing<string | number> = {};

                        _forEach(pathData, (pathItem, index: number): void => {
                            if (index === 0) {
                                stateParams.page = pathItem;
                            } else {
                                stateParams[`page${index + 1}`] = pathItem;
                            }
                        });

                        this.replaceState(stateParams);
                    }
                });
            };
        }
    }

    /**
     * Change state params for sync with digitain iframe navigation
     *
     * @param {IIndexing<string | number>} stateParams State params
     */
    protected replaceState(stateParams: IIndexing<string | number>): void {
        _merge(this.params.router.globals.params, stateParams);

        const stateName: string = this.params.router.globals.current.name;
        const urlEvent: string = this.params.router.stateService.href(stateName, stateParams);

        history.replaceState(null, null, urlEvent);
    }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService, HooksService, IHookHandlerDescriptor} from 'wlc-engine/modules/core';
import {ISportsbookSettings, SportsbookService} from 'wlc-engine/modules/sportsbook/system/services/sportsbook/sportsbook.service';
import {IGameWrapperCParams} from 'wlc-engine/modules/games';
import {BetradarService} from 'wlc-engine/modules/sportsbook/system/services/betradar/betradar.service';
import {
    hooks as gameWrapperHooks,
    IHookLaunchInfo,
} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.component';
import * as Params from './sportsbook.params';

import {
    includes as _includes,
} from 'lodash-es';

@Component({
    selector: '[wlc-sportsbook]',
    templateUrl: './sportsbook.component.html',
    styleUrls: ['./styles/sportsbook.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsbookComponent extends AbstractComponent implements OnInit, OnDestroy {

    public gameWrapperParams: IGameWrapperCParams;
    protected settings: ISportsbookSettings;
    protected hookDescriptors: IHookHandlerDescriptor[] = [];

    constructor(
        @Inject('injectParams') protected params: Params.ISportsbookCParams,
        protected cdr: ChangeDetectorRef,
        protected sportsbookService: SportsbookService,
        protected betradarService: BetradarService,
        protected configService: ConfigService,
        protected hooksService: HooksService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.ISportsbookCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        this.init();
    }

    protected async init(): Promise<void> {
        await this.sportsbookService.ready;

        this.settings = this.sportsbookService.getSportsbookSettings();
        if (this.settings) {
            this.hookDescriptors.push(this.hooksService.set<IHookLaunchInfo>(gameWrapperHooks.launchInfo, this.launchInfoHook, this));

            const gameWrapperParams: IGameWrapperCParams = {
                gameParams: {
                    merchantId: this.settings.merchantId,
                    launchCode: this.settings.launchCode,
                },
                wlcElement: 'section_sportsbook_game-play',
                theme: 'fullscreen-game-frame',
            };

            if (this.settings.id === 'betradar') {
                this.betradarService.setBetradarParams();
                this.betradarService.initNavigation(this.$destroy, this.cdr);
            } else if (this.settings.id === 'digitain') {
                gameWrapperParams.gameParams.disableIframeAutoResize = true;
            }
            this.gameWrapperParams = gameWrapperParams;
        }
        this.cdr.detectChanges();
    }

    protected launchInfoHook(data: IHookLaunchInfo): IHookLaunchInfo {
        if (this.settings.id === 'digitain') {
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
            const pageCode: string = pages[this.router.stateService.params.page] || pages.home;

            let eventId = '';
            if (_includes(['EventView', 'Upcoming', 'MultiView'], pageCode) && this.router.stateService.params.page2) {
                eventId = `_sp.push(['eventId', ${this.router.stateService.params.page2}])`;
            }

            data.launchInfo.gameScript = data.launchInfo.gameScript.replace('SportFrame.frame',
                `_sp.push(["currentPage", "${pageCode}"]); ${eventId} SportFrame.frame`);
        }
        return data;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.hooksService.clear(this.hookDescriptors);
    }

}

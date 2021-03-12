import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './sportsbook.params';
import {ConfigService} from 'wlc-engine/modules/core';
import {ISportsbookSettings, SportsbookService} from 'wlc-engine/modules/sportsbook/system/services/sportsbook/sportsbook.service';
import {IGameWrapperCParams} from 'wlc-engine/modules/games';
import {BetradarService} from 'wlc-engine/modules/sportsbook/system/services/betradar/betradar.service';

@Component({
    selector: '[wlc-sportsbook]',
    templateUrl: './sportsbook.component.html',
    styleUrls: ['./styles/sportsbook.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsbookComponent extends AbstractComponent implements OnInit {

    public gameWrapperParams: IGameWrapperCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ISportsbookCParams,
        protected cdr: ChangeDetectorRef,
        protected sportsbookService: SportsbookService,
        protected betradarService: BetradarService,
        protected configService: ConfigService,
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

        const settings: ISportsbookSettings = this.sportsbookService.getSportsbookSettings();
        if (settings) {
            const gameWrapperParams: IGameWrapperCParams = {
                gameParams: {
                    merchantId: settings.merchantId,
                    launchCode: settings.launchCode,
                },
                wlcElement: 'section_sportsbook_game-play',
                theme: 'fullscreen-game-frame',
            };

            if (settings.id === 'betradar') {
                this.betradarService.setBetradarParams();
                this.betradarService.initNavigation(this.$destroy, this.cdr);
            } else if (settings.id === 'digitain') {
                gameWrapperParams.gameParams.disableIframeAutoResize = true;
            }

            this.gameWrapperParams = gameWrapperParams;
        }
        this.cdr.detectChanges();
    }

}

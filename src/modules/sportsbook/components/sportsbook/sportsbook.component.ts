import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    HooksService,
    IWrapperCParams,
    IIndexing,
    EventService,
} from 'wlc-engine/modules/core';
import {
    SportsbookService,
    BetradarService,
    ISportsbookSettings,
    ISportsbookSettingsFilter,
    DigitainHooks,
    PinnacleHooks,
    TglabHooks,
} from 'wlc-engine/modules/sportsbook';
import {IGameWrapperCParams} from 'wlc-engine/modules/games';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './sportsbook.params';

@Component({
    selector: '[wlc-sportsbook]',
    templateUrl: './sportsbook.component.html',
    styleUrls: ['./styles/sportsbook.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportsbookComponent extends AbstractComponent implements OnInit, OnDestroy {

    public $params: Params.ISportsbookCParams;
    public gameConfig: IWrapperCParams;

    protected settings: ISportsbookSettings;
    protected hooks: IIndexing<Function> = {
        'digitain': () => {
            new DigitainHooks({
                hooksService: this.hooksService,
                disableHooks: this.$destroy,
                router: this.router,
                window: this.window,
            });
        },
        'pinnacleSW': () => {
            new PinnacleHooks({
                hooksService: this.hooksService,
                disableHooks: this.$destroy,
                window: this.window,
            });
        },
        'tglab': () => {
            new TglabHooks({
                hooksService: this.hooksService,
                disableHooks: this.$destroy,
                router: this.router,
                window: this.window,
            });
        },
    };

    constructor(
        @Inject('injectParams') protected params: Params.ISportsbookCParams,
        protected cdr: ChangeDetectorRef,
        protected sportsbookService: SportsbookService,
        protected betradarService: BetradarService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected hooksService: HooksService,
        protected router: UIRouter,
        protected translate: TranslateService,
        @Inject(WINDOW) protected window: Window,
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
        super.ngOnInit();
        this.init();
    }

    protected async init(): Promise<void> {
        await this.sportsbookService.ready;

        const filter: ISportsbookSettingsFilter = {};
        if (this.$params.common?.sportsbookId) {
            filter.id = this.$params.common.sportsbookId;
        }
        this.settings = this.sportsbookService.getSportsbookSettings(filter);

        if (this.settings) {
            this.initHooks();

            const gameWrapperParams: IGameWrapperCParams = {
                gameParams: {
                    merchantId: this.settings.merchantId,
                    launchCode: this.settings.launchCode,
                    isSportsbook: true,
                },
                wlcElement: 'section_sportsbook_game-play',
                theme: 'fullscreen-game-frame',
            };

            if (this.settings.id === 'betradar') {
                this.betradarService.setBetradarParams();
                this.betradarService.initNavigation(this.$destroy, this.cdr);
            } else if (this.settings.id === 'digitain') {
                gameWrapperParams.gameParams.disableIframeSelfResize = true;
            } else if (this.settings.id === 'tglab') {
                gameWrapperParams.gameParams.disableIframeDefaultResize = true;
            }

            this.gameConfig = {
                components: [
                    {
                        name: 'games.wlc-game-wrapper',
                        params: gameWrapperParams,
                    },
                ],
            };

            this.eventService.subscribe([
                {name: 'LOGIN'},
                {name: 'LOGOUT'},
            ], () => {
                this.gameConfig = _cloneDeep(this.gameConfig);
                this.cdr.detectChanges();
            }, this.$destroy);
        }
        this.cdr.detectChanges();
    }

    protected initHooks(): void {
        const hooks: Function = this.hooks[this.settings.id];
        if (hooks) {
            hooks();
        }
    }

}

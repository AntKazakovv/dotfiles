import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    StateService,
    UIRouter,
} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    HooksService,
    IWrapperCParams,
    IIndexing,
    EventService,
    ModalService,
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
import {BetradarEvents} from 'wlc-engine/modules/sportsbook/system/services/betradar/betradar.service';
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

    public override $params!: Params.ISportsbookCParams;
    public gameConfig!: IWrapperCParams;
    public showOwnLoader: boolean = false;

    protected isAuth: boolean;
    protected settings: ISportsbookSettings;
    protected hooks: IIndexing<Function> = {
        'digitain': () => {
            new DigitainHooks({
                hooksService: this.hooksService,
                disableHooks: this.$destroy,
                modalService: this.modalService,
                eventService: this.eventService,
                configService: this.configService,
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
        protected sportsbookService: SportsbookService,
        protected betradarService: BetradarService,
        protected eventService: EventService,
        protected hooksService: HooksService,
        protected modalService: ModalService,
        protected router: UIRouter,
        protected stateService: StateService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(
            <IMixedParams<Params.ISportsbookCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    protected async init(): Promise<void> {

        if (this.$params.ownLoader?.use) {
            this.addModifiers('show-loader');
        }

        await this.sportsbookService.ready;

        this.settings = this.sportsbookSettings();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        if (this.settings) {
            if (this.settings.id === 'betradar') {
                if (this.$params.ownLoader?.use) {
                    this.sportsbookService.onIframeMessage(BetradarEvents.loaded)
                        .subscribe(() => {
                            this.removeModifiers('show-loader');
                        });
                }
                this.betradarService.initBetradar(this.$destroy, this.cdr);
            }
            this.initHooks();
            this.initGameConfig();
            this.initSubscribers();
        }
        this.cdr.detectChanges();
    }

    protected sportsbookSettings(): ISportsbookSettings {
        const filter: ISportsbookSettingsFilter = {};
        if (this.$params.common?.sportsbookId) {
            filter.id = this.$params.common.sportsbookId;
        }
        return this.sportsbookService.getSportsbookSettings(filter);
    }

    protected initHooks(): void {
        const hooks: Function = this.hooks[this.settings.id];
        if (hooks) {
            hooks();
        }
    }

    protected initGameConfig(): void {
        const gameWrapperParams: IGameWrapperCParams = {
            gameParams: {
                merchantId: this.settings.merchantId,
                launchCode: this.settings.launchCode,
                isSportsbook: true,
                demo: !this.isAuth,
            },
            wlcElement: 'section_sportsbook_game-play',
            theme: 'fullscreen-game-frame',
        };

        if (this.settings.id === 'digitain') {
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
    }

    protected initSubscribers(): void {
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            setTimeout(()=> {
                this.stateService.reload();
            }, 0);
        }, this.$destroy);
    }
}

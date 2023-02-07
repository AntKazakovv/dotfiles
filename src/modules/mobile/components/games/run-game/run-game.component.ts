import {
    Component,
    Inject,
    OnInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {
    skipWhile,
    takeUntil,
} from 'rxjs/operators';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    EventService,
    ModalService,
    InjectionService,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    Game,
    GamesCatalogService,
} from 'wlc-engine/modules/games';

import * as Params from './run-game.params';

/**
 * View for start run game
 *
 * @example
 *
 * {
 *     name: 'mobile.wlc-run-game',
 * }
 *
 */
@Component({
    selector: '[wlc-run-game]',
    templateUrl: './run-game.component.html',
    styleUrls: ['./styles/run-game.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunGameComponent extends AbstractComponent implements OnInit {
    public $params!: Params.IRunGameCParams;
    public isAuth: boolean = false;
    public isReady: boolean = false;
    public game!: Game;
    public gameThumbParams!: IWrapperCParams;

    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected params: Params.IRunGameCParams,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected stateService: StateService,
        protected configService: ConfigService,
        protected injectionService: InjectionService,
        protected userService: UserService,
    ) {
        super(
            <IMixedParams<Params.IRunGameCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.init();
    }

    public async init(): Promise<void> {
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        this.authStatus();
        this.initGameThumb();
        this.onLoginSuccess();
        this.isReady = true;
        this.cdr.detectChanges();
    }

    /**
     * Handler for play action
     */
    public play(demo = false): void {
        this.game.launch({
            demo: demo,
        });
    }

    /**
     * Handler for play signIn action
     */
    public async signIn(): Promise<void> {
        await this.modalService.showModal('login');
    }

    protected authStatus(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.userService.userProfile$.pipe(
            skipWhile(v => !v),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.detectChanges();
        });
    }

    protected onLoginSuccess(): void {
        this.eventService.subscribe({
            name: 'USER_PROFILE',
        }, () => {
            this.game.launch({
                demo: false,
            });
        }, this.$destroy);
    }

    protected initGameThumb(): void {
        this.game = this.gamesCatalogService.getGame(
            _toNumber(this.stateService.params.merchantId),
            this.stateService.params.launchCode,
        );

        this.gameThumbParams = {
            components: [
                {
                    name: 'games.wlc-game-thumb',
                    params: {
                        type: 'modal',
                        common: {
                            game: this.game,
                        },
                        favouriteButton: {
                            disable: true,
                        },
                    },
                },
            ],
        };
    }
}

import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
    HostBinding,
    Self,
    Optional,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {ConfigService} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import * as Params from './game-thumb.params';
import {EventService, ModalService} from 'wlc-engine/modules/core/system/services';
import {IPlayGameForRealCParams} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    ActionService,
    DeviceType,
} from 'wlc-engine/modules/core';

import {
    takeUntil,
} from 'rxjs/operators';

import {
    assign as _assign,
} from 'lodash-es';

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
})
export class GameThumbComponent extends AbstractComponent implements OnInit {

    @Input() public game: Game;
    @Input() protected inlineParams: Params.IGameThumbCParams;
    @HostBinding('attr.data-wlc-element') protected wlcElement;
    @HostBinding('class.no-demo') protected noDemoClass;
    @HostBinding('class.not-desktop') protected notDesktop;
    public gameThumbSettings: IIndexing<IIndexing<string> | string> = {
        buttons: {
            demoThemeMode: 'secondary',
        },
    };
    public isAuth: boolean;
    public $params: Params.IGameThumbCParams;

    protected deviceType: DeviceType;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameThumbCParams,
        protected gamesCatalogService: GamesCatalogService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected userService: UserService,
        protected actionService: ActionService,
        protected eventService: EventService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.game && this.$params.common?.game) {
            this.game = this.$params.common.game;
        }

        this.wlcElement = `block_game-thumb-id-${this.game.ID}`;
        this.noDemoClass = !!this.game.hasDemo;
        const buttonParams = this.configService
            .get<string>('$modules.games.components.wlc-game-thumb.buttons');
        if (buttonParams) {
            _assign(this.gameThumbSettings.buttons, buttonParams);
        }
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();
    }

    /**
     * Start game
     *
     * @param {boolean} demo
     * @param {boolean} modal
     * @param {Event} $event
     */
    public startGame(demo: boolean, modal: boolean, forMobile: boolean, $event: Event): void {
        $event.stopPropagation();
        if (modal) {
            if (forMobile && this.deviceType === DeviceType.Desktop) {
                return;
            }

            if (!this.configService.get<boolean>('$user.isAuthenticated')) {
                this.showRunGameModal();
                return;
            } else {
                if (forMobile) {
                    this.showRunGameModal();
                    return;
                }
                this.modalService.closeAllModals();
                this.game.launch({
                    demo: demo,
                });
                return;
            }
        }

        this.modalService.closeAllModals();
        this.game.launch({
            demo: demo,
        });
    }

    public showRunGameModal(): void {
        const disableDemo: boolean = this.configService.get<boolean>('$user.isAuthenticated') ?
            this.configService.get<boolean>('$games.mobile.loginUser.disableDemo') : false;

        this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
            common: {
                game: this.game,
                disableDemo: disableDemo,
            },
        });
    }

    public async toggleFavourites(game: Game): Promise<void> {
        try {
            game.isFavourite = await this.gamesCatalogService.toggleFavourites(game.ID);
            this.cdr.detectChanges();
        } catch (error) {
            // TODO обработка ошибок
        }
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
                this.notDesktop = this.deviceType !== 'desktop';
                this.cdr.markForCheck();
            });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.cdr.markForCheck();
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.cdr.markForCheck();
        });

        this.gamesCatalogService.favoritesUpdated.pipe(
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.game = this.gamesCatalogService.getGame(this.game.merchantID, this.game.launchCode);
            this.cdr.detectChanges();
        });
    }
}

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {DeviceType} from 'wlc-engine/modules/core/system/models/device.model';
import {IconHelper} from 'wlc-engine/modules/core/system/helpers/icon.helper';
import {ColorThemeValues} from 'wlc-engine/modules/core/constants/color-theme.constants';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {PragmaticLiveModel} from 'wlc-engine/modules/games/system/models/pragmatic-live.model';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import * as Params from './game-thumb.params';

import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';

export type MediaType = 'background' | 'foreground' | 'logo' | 'video';

export interface IMediaContent {
    src: string;
    type: string;
}

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
})
export class GameThumbComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @Input() public game: Game;
    @Input() public dumpy: boolean = false;
    @Input() protected inlineParams: Params.IGameThumbCParams;
    @HostBinding('attr.data-wlc-element') protected wlcElement;
    @HostBinding('class.no-demo') protected noDemoClass;
    @ViewChild('video') video: ElementRef;

    public thumbParams: Params.IGameThumbCParams;
    public gameThumbSettings: Params.IGameThumbButtonsSettings = {
        demoThemeMode: 'secondary',
    };
    public isAuth: boolean;
    public $params: Params.IGameThumbCParams;
    public promoWidgetTitle: string;
    public inited: boolean = false;
    public initFailed: boolean = false;
    public merchantIconPath: string;

    /**
     * Pragmatic play live data model
     */
    public pragmaticDGA: PragmaticLiveModel;

    /**
     * return true if pragmatic dga is presented
     */
    public get hasPragmaticDGA(): boolean {
        return this.game?.merchantID === 913 && !!this.pragmaticDGA;
    }

    protected deviceType: DeviceType;
    protected idVerticalVideos: number[];
    protected mediaFormatTypes: IIndexing<string>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameThumbCParams,
        protected actionService: ActionService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.dumpy) {
            this.inited = true;
            return;
        }

        this.init();
    }

    public async init(): Promise<void> {
        await this.gamesCatalogService.ready;

        if (this.$params.common?.game) {
            this.game = this.$params.common.game;
        } else if (this.$params.common?.gameId) {
            this.game = this.gamesCatalogService.getGameById(this.$params.common.gameId);
        }

        if (this.game?.merchantID === 913) {
            this.gamesCatalogService.subscribePragmaticLive(
                this.game,
                this.$destroy,
                (pragmaticData: PragmaticLiveModel) => {
                    if (pragmaticData) {
                        this.pragmaticDGA = pragmaticData;
                        this.cdr.detectChanges();
                    }
                });
            this.eventService.subscribe(
                [
                    {name: 'LOGIN'},
                    {name: 'LOGOUT'},
                ],
                () => {
                    if (this.pragmaticDGA) {
                        setTimeout(() => {
                            this.cdr.detectChanges();
                        });
                    }
                },
                this.$destroy);
        }

        if (this.$params.type === 'promo-widget') {

            if (this.$params.common?.promoWidget?.title) {
                this.promoWidgetTitle = this.$params.common.promoWidget.title;
            }

            try {
                if (this.$params.common?.promoWidget?.gameCategory) {
                    const gameList: Game[] = await this.gamesCatalogService
                        .getGamesByCategorySlug(this.$params.common.promoWidget.gameCategory);
                    if (gameList.length) {
                        this.game = gameList[0];
                    }
                }
            } catch (err) {
                this.initFailed = true;
            }
        }

        if (!this.game) {
            this.initFailed = true;
            this.inited = true;
            return;
        }

        if (this.$params.type === 'vertical') {
            this.idVerticalVideos = await this.gamesCatalogService.getIdVerticalVideos();
            this.mediaFormatTypes = this.configService.get<IIndexing<string>>('$games.mediaFormatTypes');
        }

        this.wlcElement = `block_game-thumb-id-${this.game.ID}`;
        this.noDemoClass = !!this.game.hasDemo;
        const buttonParams = this.configService
            .get<string>('$modules.games.components.wlc-game-thumb.buttons');

        if (buttonParams) {
            _assign(this.gameThumbSettings, buttonParams);
        }

        if (this.$params.common?.merchantIcon?.use) {
            this.merchantIconPath = IconHelper.getIconPath(
                this.game.getMerchantName(),
                'merchants',
                this.$params.common.merchantIcon.showAs || 'img',
                IconHelper.getColorThemeBgType(
                    this.$params.common.merchantIcon.colorIconBg || 'dark',
                    this.configService
                        .get<string>(ColorThemeValues.configName) === ColorThemeValues.altThemeName,
                ),
            );

            this.addModifiers('merchant-icon');

            if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
                this.eventService.subscribe<boolean>(
                    {name: ColorThemeValues.changeEvent},
                    (theme) => {
                        this.merchantIconPath = IconHelper.getIconPath(
                            this.game.getMerchantName(),
                            'merchants',
                            this.$params.common.merchantIcon.showAs || 'img',
                            IconHelper.getColorThemeBgType(
                                this.$params.common.merchantIcon.colorIconBg || 'dark',
                                theme,
                            ),
                        );
                        this.cdr.markForCheck();
                    },
                    this.$destroy,
                );
            }
        }

        this.addModifiers(`${this.game.merchantAlias.toLowerCase()}`);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.initEventHandlers();
        this.inited = true;
        this.cdr.detectChanges();
    }

    public ngAfterViewInit(): void {

        if (this.video) {
            this.video.nativeElement.muted = true;
            this.video.nativeElement.play();
        }
    }

    /**
     * Start game
     *
     * @param {boolean} demo
     * @param {boolean} modal
     * @param {Event} $event
     */
    public startGame(demo: boolean, modal: boolean, $event: Event): void {
        $event.stopPropagation();

        this.gamesCatalogService.launchGame(this.game, {
            demo,
            modal: {
                show: modal,
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

    public get hasVideo(): boolean {
        return this.idVerticalVideos.includes(this.game.ID);
    }


    public getVerticalContent(type: MediaType, format: string[] | string): IMediaContent[] | string {
        const gameName = this.game.name?.en;

        if (!gameName) return;

        const path = this.configService.get<string>('$games.verticalImagesPath') + gameName
            .toLowerCase()
            .replace(/[&\/:\\|]/g, '')
            .replace(/\s/g, '-');

        if (_isArray(format)) {
            return _map(format, el => ({
                src: `${path}/${type}.${el}`,
                type: _get(this.mediaFormatTypes, el),
            }));
        } else {
            return `${path}/${type}.${format}`;
        }
    }

    /**
     * hide merchant icon block where icon not found
     */
    public merchantIconErrorHolder(): void {
        this.merchantIconPath = '';
        this.removeModifiers('merchant-icon');
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.deviceType = type;
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

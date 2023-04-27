import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    OnInit,
    ViewChild,
    ViewChildren,
    QueryList,
    Renderer2,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    fromEvent,
    Subscription,
} from 'rxjs';
import {
    map,
    takeUntil,
} from 'rxjs/operators';

import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _forEach from 'lodash-es/forEach';
import _concat from 'lodash-es/concat';
import _includes from 'lodash-es/includes';

import {
    AppType,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ColorThemeService} from 'wlc-engine/modules/core/system/services/color-theme/color-theme.service';
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
import {TColorTheme} from 'wlc-engine/modules/core/system/interfaces/base-config/color-theme-switching.config';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import * as Params from './game-thumb.params';

@Component({
    selector: '[wlc-game-thumb]',
    templateUrl: './game-thumb.component.html',
    styleUrls: ['./styles/game-thumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameThumbComponent extends AbstractComponent implements OnInit {

    @Input() public game: Game;
    @Input() public dumpy: boolean = false;
    @Input() protected inlineParams: Params.IGameThumbCParams;
    @HostBinding('attr.data-wlc-element') protected wlcElement;
    @HostBinding('class.no-demo') protected noDemoClass;
    @HostBinding('class.thumb-transform') protected isTransform;
    @ViewChild('video') video: ElementRef;
    @ViewChild('transform') transform: ElementRef;
    @ViewChildren('layersOne') layersOne: QueryList<ElementRef<HTMLElement>>;
    @ViewChildren('layersTwo', {read: ElementRef}) layersTwo: QueryList<ElementRef<HTMLElement>>;

    public thumbParams: Params.IGameThumbCParams;
    public gameThumbSettings: Params.IGameThumbButtonsSettings = {
        demoThemeMode: 'secondary',
    };
    public isAuth: boolean;
    public isKiosk: boolean;
    public isMobile: boolean = true;
    public override $params: Params.IGameThumbCParams;
    public promoWidgetTitle: string;
    public inited: boolean = false;
    public initFailed: boolean = false;
    public merchantIconPath: string;
    public foreground: Params.IMediaContent[];
    public foregroundFallback: Params.IMediaContent[];
    public background: Params.IMediaContent[];
    public backgroundFallback: Params.IMediaContent[];
    public logo: Params.IMediaContent[];
    public logoFallback: Params.IMediaContent[];
    public videos: Params.IMediaContent[];
    public useWebp: boolean = true;
    public hasVideo: boolean = false;

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
    protected mediaFormatTypes: IIndexing<string>;
    protected currentLanguage: string;
    protected staticTData: Partial<Params.IStaticTransformData>;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IGameThumbCParams,
        protected actionService: ActionService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected eventService: EventService,
        protected colorThemeService: ColorThemeService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
        protected elementRef: ElementRef<HTMLElement>,
        protected renderer: Renderer2,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.dumpy && this.$params.dumpy) {
            this.dumpy = true;
            this.cdr.markForCheck();
        }

        if (this.dumpy) {
            this.inited = true;
            this.cdr.markForCheck();
            return;
        }
        this.init();
    }

    /**
     * Returns the name of the game in the current language, if any.
     * Otherwise in English.
     *
     * @return {string} game name
     */
    public get name(): string {
        return this.game.name[this.currentLanguage] || this.game.name.en;
    }

    public get showMerchantIcon(): boolean {
        return this.merchantIconPath && !this.$params.common?.merchantIcon?.showNameInsteadIcon;
    }

    public async init(): Promise<void> {
        await this.gamesCatalogService.gameThumbReady;
        const gameId = this.$params.common?.gameId;
        this.currentLanguage = this.configService.get<string>('currentLanguage');

        if (GlobalHelper.isMobileApp()) {
            this.useWebp = false;
        }
        this.mediaFormatTypes = this.configService.get<IIndexing<string>>('$games.mediaFormatTypes');
        if (this.$params.common?.game) {
            this.game = this.$params.common.game;
        } else if (gameId) {
            if (_isArray(gameId)) {
                gameId.some((game: number): boolean => {
                    this.game = this.gamesCatalogService.getGameById(game);
                    return !!this.game;
                });
            } else {
                this.game = this.gamesCatalogService.getGameById(gameId);
            }
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

                if (!this.promoWidgetTitle && this.game) {
                    this.promoWidgetTitle = this.game.name[this.configService.get<string>('currentLanguage') || 'en']
                        || this.game.name.en;
                }
            } catch (err) {
                this.initFailed = true;
                this.inited = true;
                this.cdr.markForCheck();
            }
        }

        if (!this.game) {
            this.initFailed = true;
            this.inited = true;
            this.cdr.markForCheck();
            return;
        }

        if (this.$params.type === 'vertical') {
            this.background = this.getMediaContent('background', ['webp']);
            this.backgroundFallback = this.getMediaContent('background', ['png', 'jpg']);
            this.foreground = this.getMediaContent('foreground', ['webp']);
            this.foregroundFallback = this.getMediaContent('foreground', ['png']);
            this.logo = this.getMediaContent('logo', ['webp']);
            this.logoFallback = this.getMediaContent('logo', ['png']);
        }
        this.videos = this.getMediaContent('video', ['av1.mp4', 'hevc.mp4', 'h264.mp4']);

        this.wlcElement = `block_game-thumb-id-${this.game.ID}`;
        this.noDemoClass = !this.game.hasDemo;
        this.isTransform = this.$params.transformThumb?.use;
        const buttonParams = this.configService
            .get<string>('$modules.games.components.wlc-game-thumb.buttons');

        if (buttonParams) {
            _assign(this.gameThumbSettings, buttonParams);
        }

        if (this.$params.common?.merchantIcon?.use && !this.$params.common.merchantIcon.showNameInsteadIcon) {
            const merchantName = this.game.getMerchantName(!this.$params.common.merchantIcon.showSubMerchantLogo);

            this.merchantIconPath = IconHelper.getIconPath(
                merchantName,
                'merchants',
                this.$params.common.merchantIcon.showAs || 'img',
                IconHelper.getColorThemeBgType(
                    this.$params.common.merchantIcon.colorIconBg || 'dark',
                    this.configService.get<string>(ColorThemeValues.configName) === ColorThemeValues.altThemeName,
                ),
            );

            this.addModifiers('merchant-icon');

            if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
                this.colorThemeService.appColorTheme$.pipe(takeUntil(this.$destroy)).subscribe((theme: TColorTheme) => {
                    this.merchantIconPath = IconHelper.getIconPath(
                        merchantName,
                        'merchants',
                        this.$params.common.merchantIcon.showAs || 'img',
                        IconHelper.getColorThemeBgType(
                            this.$params.common.merchantIcon.colorIconBg || 'dark',
                            theme !== 'default',
                        ),
                    );
                    this.cdr.markForCheck();
                });
            }
        }

        this.addModifiers(`${this.game.merchantAlias.toLowerCase()}`);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.isKiosk = this.configService.get<AppType>('$base.app.type') === 'kiosk';
        this.initEventHandlers();
        this.hasVideo = !this.isMobile && this.gamesCatalogService.hasVideo(this.game.ID, this.$params.type);
        this.inited = true;
        this.cdr.detectChanges();

        if (this.video) {
            this.renderer.setProperty(this.video.nativeElement, 'muted', true);
            this.video.nativeElement.play();
        }

        if (this.isTransform) {
            this.settingVerticalThumb();
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

    /**
     * getting media content for thumbs
     *
     * @param type - kinds media content
     * @param format - extension file
     * @returns {Params.IMediaContent[] | string}
     */

    public getMediaContent(type: Params.MediaType, format: string[]): Params.IMediaContent[] {
        const gameName = this.game.name?.en;
        const merchantName = this.game.getMerchantName();

        if (!gameName) return;

        let mediaPath = `/gstatic/games/${merchantName}/`;

        if(this.$params.type === 'vertical') {
            mediaPath = this.configService.get<string>('$games.verticalImagesPath');
        }
        const path = mediaPath + gameName
            .toLowerCase()
            .replace(/[&\/:\\|]/g, '')
            .replace(/\s/g, '-');

        return _map(format, (el: string): Params.IMediaContent => ({
            src: `${path}/${type}.${el}`,
            type: _get(this.mediaFormatTypes, el),
        }));
    }

    /**
     * hide merchant icon block where icon not found
     */
    public merchantIconErrorHolder(): void {
        this.merchantIconPath = '';
        this.removeModifiers('merchant-icon');
    }

    /**
     * method for settings thumb
     */
    protected settingVerticalThumb(): void {
        const transformThumb: Params.ITransformThumb = this.$params.transformThumb;

        this.staticTData = {
            layersAll: _concat(this.layersOne.toArray(), this.layersTwo.toArray()),
            centerCoords: {
                x: this.elementRef.nativeElement.offsetWidth / 2,
                y: this.elementRef.nativeElement.offsetHeight / 2,
            },
        };

        this.staticTData.hostSteps = {
            x: (this.layersOne.length || 1) / (this.staticTData.centerCoords.x /
                (transformThumb?.correct?.host?.x || 1)),
            y: (this.layersOne.length || 1) / (this.staticTData.centerCoords.y /
                (transformThumb?.correct?.host?.y || 2.5)),
        };

        this.staticTData.layerSteps = _map(this.staticTData.layersAll,
            (layer: ElementRef<HTMLElement>, index: number): Params.ICoordinates => {
                const indexLayer: number = _includes(this.layersTwo.toArray(), layer) ?
                    this.layersOne.length + 1 : index + 1;
                const stepX: number = indexLayer / (this.staticTData.centerCoords.x /
                    (transformThumb?.correct?.layers?.x || 1.5));
                const stepY: number = indexLayer / (this.staticTData.centerCoords.y /
                    (transformThumb?.correct?.layers?.y || 2.5));
                return {x: stepX, y: stepY};
            });
    }

    /**
     * Handler mouse move
     *
     * @param mouseCoords {Params.ICoordinates}
     */
    protected mouseMove(mouseCoords: Params.ICoordinates): void {
        const mouseX: number = mouseCoords.x - this.elementRef.nativeElement.getBoundingClientRect().left;
        const mouseY: number = mouseCoords.y - this.elementRef.nativeElement.getBoundingClientRect().top;
        const rotateX: string = ((this.staticTData.centerCoords.y - mouseY) * this.staticTData.hostSteps.x).toFixed(2);
        const rotateY: string = ((mouseX - this.staticTData.centerCoords.x) * this.staticTData.hostSteps.y).toFixed(2);

        this.renderer.setStyle(
            this.transform.nativeElement,
            'transform',
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        );

        _forEach(this.staticTData.layerSteps, (layer: Params.ICoordinates, index: number): void => {
            const translateX: string = ((mouseX - this.staticTData.centerCoords.x) * layer.x).toFixed(2);
            const translateY: string = (-1 * ((this.staticTData.centerCoords.y - mouseY) * layer.y)).toFixed(2);

            this.renderer.setStyle(
                this.staticTData.layersAll[index].nativeElement,
                'transform',
                `translate(${translateX}px, ${translateY}px)`,
            );
        });
    }

    /**
     * Successful image load
     */
    public successfulLoadImage(): void {
        this.addModifiers('successful-load-image');
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        let mouseEvents$: Subscription;

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                this.deviceType = type;
                if (type === 'desktop') {
                    this.isMobile = false;
                }
                if (this.deviceType === DeviceType.Desktop && this.isTransform) {

                    mouseEvents$ = fromEvent(this.elementRef.nativeElement, 'mousemove')
                        .pipe(
                            map((event: MouseEvent): Params.ICoordinates => ({x: event.x, y: event.y})),
                            takeUntil(this.$destroy),
                        )
                        .subscribe((mouseCoords: Params.ICoordinates): void => {
                            this.mouseMove(mouseCoords);
                        }),
                    mouseEvents$.add(
                        fromEvent(this.elementRef.nativeElement, 'mouseleave')
                            .pipe(takeUntil(this.$destroy))
                            .subscribe((): void => {
                                _forEach(
                                    [...this.staticTData.layersAll, this.transform],
                                    (element: ElementRef<HTMLElement>): void => {
                                        this.renderer.removeStyle(element.nativeElement, 'transform');
                                    });
                            }),
                    );
                } else if (mouseEvents$) {
                    mouseEvents$.unsubscribe();
                }

                this.cdr.markForCheck();
            });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, (): void => {
            this.isAuth = false;
            this.cdr.detectChanges();

            if (this.isTransform) {
                this.settingVerticalThumb();
            }
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, (): void => {
            this.isAuth = true;
            this.cdr.detectChanges();

            if (this.isTransform) {
                this.settingVerticalThumb();
            }
        });

        this.gamesCatalogService.favoritesUpdated.pipe(
            takeUntil(this.$destroy),
        ).subscribe((): void => {
            this.game = this.gamesCatalogService.getGame(this.game.merchantID, this.game.launchCode) || this.game;
            this.cdr.detectChanges();
        });
    }
}

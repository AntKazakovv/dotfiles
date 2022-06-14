import {
    Component,
    OnInit,
    Inject,
    ElementRef,
    ChangeDetectorRef,
    ViewChild,
    ViewContainerRef,
    Renderer2,
    ViewEncapsulation,
    HostListener,
    OnDestroy,
    AfterViewInit,
    Input,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    DomSanitizer,
    Title,
} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {ResizedEvent} from 'angular-resize-event';
import {
    UIRouter,
    RawParams,
    StateService,
} from '@uirouter/core';
import {fromEvent} from 'rxjs';
import {
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';
import _isString from 'lodash-es/isString';
import _isObject from 'lodash-es/isObject';
import _isFunction from 'lodash-es/isFunction';
import _includes from 'lodash-es/includes';
import _toNumber from 'lodash-es/toNumber';
import _find from 'lodash-es/find';
import _get from 'lodash-es/get';

import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    IPlayGameForRealCParams,
} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {GameDashboardEvents} from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';
import {
    IExcludeMerchantSettings,
    ICustomGameParams,
    IGameParams,
    ILaunchInfo,
    TDisableDemoFor,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    AbstractComponent,
    ActionService,
    ConfigService,
    DeviceType,
    HooksService,
    IPushMessageParams,
    NotificationEvents,
    EventService,
    LogService,
    ModalService,
    ICheckboxCParams,
    IIndexing,
    SeoService,
    InjectionService,
    AppType,
    TWaiter,
} from 'wlc-engine/modules/core';
import {MerchantWalletService} from 'wlc-engine/modules/games/system/services/merchant-wallet/merchant-wallet.service';
import {
    BetGamesHooks,
} from './hooks';
import {
    defaultParams,
    IGameWrapperCParams,
} from './game-wrapper.params';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {IMerchantWalletPreviewCParams}
    from 'wlc-engine/modules/games/components/merchant-wallet/merchant-wallet-preview/merchant-wallet-preview.params';

interface IError {
    msg?: string;
    state?: string;
    stateParams?: RawParams;
}

export const gameWrapperHooks = {
    launchInfo: 'launchInfo@GameWrapperComponent',
    evalScript: 'evalScript@GameWrapperComponent',
    iframeShown: 'iframeShown@GameWrapperComponent',
};

export interface IGameWrapperHookLaunchInfo {
    game: Game;
    launchInfo: ILaunchInfo;
    customGameParams: ICustomGameParams;
    demo: boolean;
}

export interface IGameWrapperHookEvalScript {
    game: Game;
    customGameParams: ICustomGameParams;
    disable: boolean;
}

export interface IGameWrapperHookIframeShown {
    iframe: HTMLElement;
    mobile: boolean;
}

@Component({
    selector: '[wlc-game-wrapper]',
    templateUrl: './game-wrapper.component.html',
    styleUrls: ['./styles/game-wrapper.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GameWrapperComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('wrp', {read: ViewContainerRef, static: false}) wrp: ViewContainerRef;
    @ViewChild('header') header: ElementRef;
    @ViewChild('footer') footer: ElementRef;
    @ViewChild('gameContainer') gameContainer: ElementRef<HTMLElement>;

    @Input() public inlineParams: IGameWrapperCParams;

    public $params: IGameWrapperCParams;
    public game: Game;
    public gameHtml: string = '';
    public useMobileIframe: boolean = false;
    public mobileIframeLoaded: boolean = false;
    public isReady: boolean;
    public locale: string;
    public gameParams: IGameParams;
    public isAuth: boolean;
    public isKiosk: boolean;
    public gameTitle: string;
    public openDashboard: boolean = true;
    public showDashboardBtn: boolean = false;
    public mobileGame: boolean = this.configService.get<boolean>('appConfig.mobile');
    public dashboardBtn: ICheckboxCParams = {
        name: 'game-dashboard',
        type: 'toggle',
        text: gettext('Dashboard'),
        textSide: 'left',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.toggleDasgboard(checked);
        },
    };
    public isMobile: boolean = false;
    public enableGameHeader: boolean;
    public isMerchantWallet: boolean;
    public headerMerchantWalletPreview: IMerchantWalletPreviewCParams = {
        theme: 'fullscreen-game-frame',
        common: {
            buttons: {
                type: 'resizable',
            },
        },
    };

    protected realMobile: boolean = false;
    protected aspectRatio: string;
    protected aspectRatioCoefficient: number;
    protected launchInfo: ILaunchInfo;
    protected gameScriptTimeout: any;
    protected destroyed: boolean = false;
    protected containerObserver: MutationObserver;
    protected iframeObserver: MutationObserver;
    protected titleObserver: MutationObserver;
    protected iframe: HTMLElement;
    protected isIframeHeight: boolean = false;
    protected savedSiteName: string;
    protected oldWindowWidth: number;
    protected screenfull: IScreenfull;
    protected hooksByMerchant: IIndexing<Function> = {
        '990': () => {
            new BetGamesHooks({
                hooksService: this.hooksService,
                disableHooks: this.$destroy,
            });
        },
    };
    protected merchantWalletService: MerchantWalletService;

    constructor(
        @Inject('injectParams') protected injectParams: IGameWrapperCParams,
        @Inject(DOCUMENT) protected document: Document,
        @Inject(WINDOW) protected window: Window,
        protected router: UIRouter,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected logService: LogService,
        protected elementRef: ElementRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected hostElement: ElementRef,
        protected hooksService: HooksService,
        protected titleService: Title,
        protected seoService: SeoService,
        protected stateService: StateService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (this.configService.get<boolean>('appConfig.mobile')) {
            this.isMobile = true;
            this.realMobile = true;
            this.addModifiers('real-mobile');
        }
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.isKiosk = this.configService.get<AppType>('$base.app.type') === 'kiosk';
        this.locale = this.router.stateService.params?.locale || 'en';
        this.gameParams = this.getGameParams();
        this.initEventHandlers();
        this.savedSiteName = this.titleService.getTitle();

        this.enableGameHeader = _includes(
            this.configService.get<number[]>('$games.mobile.showGameHeader.merchants'),
            this.gameParams.merchantId,
        );

        this.game = this.getGame();
        this.gameTitle = this.game.name[this.locale] || this.game.name['en'] || '';

        if (this.game) {
            this.gamesCatalogService.getFavouriteGames();
            await this.openActiveGame();
            this.cdr.detectChanges();
            this.initStartResizeParams();
        } else {
            this.logService.sendLog({code: '3.0.4', data: {gameParams: this.gameParams}});
            this.setError({
                msg: gettext('The game does not exist or the game settings are incorrect'),
                state: 'app.home',
            });
        }

        if (
            (this.configService.get<TDisableDemoFor>('$games.disableDemoBtnsFor') === 'auth')
            && this.gameParams.demo
        ) {
            this.eventService.subscribe(
                {name: 'LOGIN'},
                () =>  {
                    // Reload to get error if we play demo and login
                    this.stateService.reload();
                },
                this.$destroy);
        }
        this.screenfull = (await import('screenfull'))?.default;
    }

    public ngAfterViewInit(): void {
        this.showDashboardBtn = true;
        this.initStartResizeParams();
        this.initFullPageIframeSize();
        if (!this.configService.get<boolean>('$base.useSeo')) {
            this.titleService.setTitle(`${this.gameTitle} | ${this.configService.get<boolean>('$base.site.name')}`);
        }

        this.titleObserver = new MutationObserver(() => {
            this.titleObserver.disconnect();
            this.titleObserver = null;
            if (this.configService.get<boolean>('$base.useSeo')) {
                this.seoService.setTitle();
            } else {
                this.titleService.setTitle(`${this.gameTitle} | ${this.configService.get<boolean>('$base.site.name')}`);
            }
        });

        this.titleObserver.observe(this.document.querySelector('title'), {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }

    @HostListener('window:resize') onWResize() {
        if (this.$params) {
            this.setGameWindowSize();
        }
    }

    public onResize(event: ResizedEvent): void {
        this.setGameWindowSize(event.newRect.width);
    }

    /**
     * Play game for real
     */
    public playForReal(): void {
        this.game.launch({
            demo: false,
        });
    }

    /**
     * Open game on full screen
     */
    public openOnFullscreen(): void {
        const container: HTMLElement = this.iframe
            ? this.iframe
            : this.wrp.element.nativeElement.querySelector('#egamings_container');
        if (container) {
            this.requestFullscreen(container);
            if (this.iframe) {
                const scrollAttr: string = this.iframe.getAttribute('scrolling');
                this.iframe.setAttribute('scrolling', 'auto');

                const fullScreenEvent = fromEvent(container, 'onfullscreenchange');
                const subscription = fullScreenEvent.subscribe(()=> {
                    if (!this.document.fullscreenElement) {
                        if (scrollAttr) {
                            this.iframe.setAttribute('scrolling', scrollAttr);
                        } else {
                            this.iframe.removeAttribute('scrolling');
                        }
                        subscription.unsubscribe();
                    }
                });
            }
        }
    }

    /**
     * Toggle favourite btn
     * @returns {Promise<void>}
     */
    public async toggleFavouriteBtn(): Promise<void> {
        if (!this.game) {
            return;
        }
        try {
            await this.gamesCatalogService.toggleFavourites(this.game.ID);
        } catch (error) {
        }
    }

    public closeGame(): void {
        // TODO: this.returnToPrevState() after migrating to a native angular routing system;
        this.eventService.emit({name: 'CLOSE_GAME'});
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.destroyed = true;
        this.containerObserver?.disconnect();
        if (this.iframeObserver) {
            this.iframeObserver?.disconnect();
        }
        if (!this.configService.get<boolean>('$base.useSeo')) {
            this.titleService.setTitle(this.savedSiteName);
        }
        if (this.titleObserver) {
            this.titleObserver.disconnect();
        }
        if (this.merchantWalletService) {
            this.merchantWalletService.endMerchantWalletGame();
        }
    }

    /**
     * On game html rendered
     *
     * @returns {Promise<void>}
     */
    public async onGameHtmlRendered(): Promise<void> {
        if (!this.launchInfo?.gameScript) {
            return;
        }

        try {
            this.runGameScript();
        } catch (error) {
            this.logService.sendLog({
                code: '3.0.8',
                data: {
                    error: error,
                    gameId: this.game.ID,
                },
                from: {
                    component: 'GameWrapperComponent',
                    method: 'onGameHtmlRendered',
                },
            });
            this.setError();
        }
    }

    protected async runGameScript(): Promise<void> {
        const result = await this.hooksService.run<IGameWrapperHookEvalScript>(gameWrapperHooks.evalScript, {
            game: this.game,
            customGameParams: this.$params?.gameParams,
            disable: false,
        });
        if (!result.disable) {
            eval(this.launchInfo?.gameScript);
        }
    }

    protected getGame(): Game {
        return this.gamesCatalogService.getGame(
            _toNumber(this.gameParams.merchantId),
            this.gameParams.launchCode,
            !!this.$params.gameParams?.isSportsbook,
            true,
        );
    }

    /**
     * Toggle game dashboard
     *
     * @param {boolean} open
     */
    protected toggleDasgboard(open: boolean): void {
        open ? this.addModifiers('open-dashboard') : this.removeModifiers('open-dashboard');
        this.openDashboard = open;
    }

    protected initStartResizeParams(): void {
        if (this.$params.theme === 'default') {
            this.aspectRatio = this.game?.aspectRatio || 'auto';
            this.aspectRatioCoefficient = this.getAspectRatioCoefficient();
            this.checkIframe();
        }
    }

    protected initFullPageIframeSize(): void {
        if (this.$params.gameParams?.disableIframeDefaultResize) {
            return;
        }

        if (this.$params.theme === 'fullscreen-game-frame' && this.hostElement) {
            this.containerObserver = new MutationObserver(() => {
                const iframe = this.document.querySelector('#egamings_container iframe');
                if (iframe) {
                    this.iframe = iframe as HTMLElement;
                    this.iframe.setAttribute('scrolling', 'auto');
                    this.containerObserver.disconnect();
                    this.containerObserver = null;
                    this.setFullPageIframeSize();

                    this.iframeObserver = new MutationObserver(() => {
                        this.setFullPageIframeSize();
                    });
                    this.iframeObserver.observe(iframe, {
                        attributes: true,
                        attributeFilter: ['height'],
                    });
                }
            });
            this.containerObserver.observe(this.hostElement.nativeElement, {
                childList: true,
                subtree: true,
            });
        }
    }

    protected setFullPageIframeSize(): void {
        if (this.$params.gameParams?.disableIframeDefaultResize) {
            return;
        }

        if (this.hostElement?.nativeElement) {
            const elem = this.hostElement.nativeElement;
            const iframe = this.wrp?.element?.nativeElement.querySelector('iframe');

            let height: string = (this.window.innerHeight - elem.offsetTop) + 'px';

            const iframeHeightAttr: string = iframe?.getAttribute('height');
            if (_includes(iframeHeightAttr, 'px') && height && !this.$params.gameParams?.disableIframeSelfResize) {
                const iframeHeight: number = parseInt(iframeHeightAttr);
                const calcHeight: number = parseInt(height);
                if (iframeHeight > calcHeight) {
                    height = null;
                }
            }
            this.renderer.setStyle(elem, 'height', height);
            if (iframe) {
                this.renderer.setStyle(iframe, 'height', height);
            }
        }
    }

    protected checkIframe(): void {
        this.containerObserver = new MutationObserver(() => {
            const iframe = this.wrp?.element?.nativeElement.querySelector('iframe');
            if (iframe) {
                this.hooksService.run<IGameWrapperHookIframeShown>(gameWrapperHooks.iframeShown, {
                    iframe: iframe,
                    mobile: this.isMobile,
                });
                this.iframe = iframe;
                const iframeAttrHeight = this.iframe.getAttribute('height');
                if (iframeAttrHeight && iframeAttrHeight !== '100%') {
                    this.isIframeHeight = true;
                    this.setGameWindowSize();
                    this.setIframeObserver();
                }
                this.containerObserver.disconnect();
            }
        });

        this.containerObserver.observe(this.wrp?.element?.nativeElement, {
            childList: true,
            subtree: true,
        });
    }

    protected setIframeObserver(): void {
        this.iframeObserver = new MutationObserver(() => {
            this.setGameWindowSize();
        });

        this.iframeObserver.observe(this.iframe, {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }

    protected setGameWindowSize(width?: number): void {
        if (this.$params.theme === 'fullscreen-game-frame') {
            this.setFullPageIframeSize();
            return;
        }

        const gameWrapper: HTMLElement = this.wrp?.element?.nativeElement;
        if (!gameWrapper) {
            return;
        }

        if (this.isMobile) {
            this.renderer.setStyle(gameWrapper, 'height', '100%');
            this.renderer.setStyle(gameWrapper, 'maxWidth', '100%');
        } else if (!this.realMobile || (this.realMobile && this.windowWidthChanged())) {

            const iframeHeight: string = this.iframe?.getAttribute('height');
            if (iframeHeight && iframeHeight !== '100%') {
                this.renderer.setStyle(gameWrapper, 'height', iframeHeight + 'px');
                return;
            }

            const maxHeight: number = this.getMaxHeight();
            const minHeight: number = this.$params.gameParams?.minGameWindowHeight || 0;
            if (!width) {
                width = this.wrp?.element?.nativeElement.parentElement.getBoundingClientRect().width;
            }

            if (this.aspectRatioCoefficient && width) {
                let elementHeight: number = width / this.aspectRatioCoefficient,
                    elementNewWidth: number = 0;

                if (elementHeight > maxHeight) {
                    elementHeight = maxHeight;
                }
                if (elementHeight < minHeight) {
                    elementHeight = minHeight;
                }

                elementNewWidth = elementHeight * this.aspectRatioCoefficient;

                this.renderer.setStyle(gameWrapper, 'height', elementHeight + 'px');
                this.renderer.setStyle(gameWrapper, 'maxWidth', elementNewWidth + 'px');
                this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', elementNewWidth + 'px');
            } else {
                this.renderer.setStyle(gameWrapper, 'height', '100%');
                this.renderer.setStyle(gameWrapper, 'maxWidth', '100%');
                this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', '100%');
            }
        }

        if (this.iframe && this.isIframeHeight) {
            this.renderer.setStyle(gameWrapper, 'height', _toNumber(this.iframe.getAttribute('height')));
        }
    }

    /**
     * Was window width change or not from last time
     *
     * @returns {boolean}
     */
    protected windowWidthChanged(): boolean {
        if (this.window.innerWidth != this.oldWindowWidth) {
            this.oldWindowWidth = this.window.innerWidth;
            return true;
        }
        return false;
    }

    protected getAspectRatioCoefficient(): number {
        const AR = this.aspectRatio || '16:9';
        if (AR !== 'auto') {
            let aspectRatio = AR.split(':').map((a: string) => _toNumber(a));
            if (aspectRatio.length !== 2) {
                aspectRatio = [16, 9];
            }
            return aspectRatio[0] / aspectRatio[1];
        } else {
            return 0;
        }
    }

    protected getMaxHeight(): number {
        const windowHeight = this.window.innerHeight;
        const wrpElTop = this.wrp?.element?.nativeElement.getBoundingClientRect().top + this.window.scrollY;
        const padding = this.$params?.padding || 0;
        const elFooterHeight = this.footer.nativeElement.getBoundingClientRect().height || 0;
        return windowHeight - wrpElTop - padding - elFooterHeight;
    }

    /**
     * Run in fullscreen
     *
     * @param {HTMLElement} element
     */
    protected requestFullscreen(element: HTMLElement): void {
        if (this.screenfull?.isEnabled) {
            this.screenfull.request(element);
        }
    }

    /**
     * Return from game
     */
    protected returnToPrevState() {
        // TODO add return to prev state
        this.router.stateService.go('app.home');
    }

    /**
     * Check is game favorite or not
     *
     * @returns {Promise<boolean>}
     */
    protected async updateFavorites(): Promise<void> {
        if (!this.game || !this.configService.get<boolean>('$user.isAuthenticated')) {
            return;
        }
        try {
            this.gamesCatalogService.getFavouriteGames();
        } catch (error) {
            this.logService.sendLog({code: '3.0.13', data: {error}});
        }
    }

    /**
     * Get game params
     *
     * @returns {IGameParams}
     */
    protected getGameParams(): IGameParams {
        return {
            merchantId: this.$params.gameParams?.merchantId || _toNumber(this.router.stateService.params?.merchantId),
            launchCode: this.$params.gameParams?.launchCode || this.router.stateService.params?.launchCode || '',
            lang: this.locale,
            demo: this.$params.gameParams?.demo || this.router.stateService.params?.demo === 'true',
            gameId: this.$params.gameParams?.gameId || this.router.stateService.params?.gameId || '',
            returnUrl: `${location.origin}/${this.locale}`,
        };
    }

    protected async openActiveGame(): Promise<boolean> {
        try {
            await this.getLaunchParams();
            this.isReady = true;
            this.cdr.detectChanges();

            if (this.useMobileIframe) {
                return this.runInMobileIframe();
            }
            if (!this.gameHtml) {
                this.runGameScript();
            }
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get launch params
     *
     * @returns {Promise<void>}
     */
    protected async getLaunchParams(): Promise<void> {
        const waiter: TWaiter = this.logService.waiter({code: '3.0.3'});
        try {
            const launchInfo: ILaunchInfo = await this.gamesCatalogService.getLaunchParams(this.gameParams);

            const result = await this.hooksService.run<IGameWrapperHookLaunchInfo>(gameWrapperHooks.launchInfo, {
                game: this.game,
                launchInfo: launchInfo,
                customGameParams: this.$params.gameParams,
                demo: this.gameParams.demo,
            });
            this.game = result.game;
            this.launchInfo = result.launchInfo;

            this.launchInfo = launchInfo;
            if (this.checkLaunch(launchInfo)) {
                //this.launchInfo.gameScript = await this.getGameScript(this.launchInfo.gameScript);
                if (this.configService.get<boolean>('appConfig.mobile')) {
                    this.useOrNotMobileIframe();
                }
                this.gameHtml = this.domSanitizer
                    .bypassSecurityTrustHtml(launchInfo.gameHtml)?.['changingThisBreaksApplicationSecurity'];
                this.cdr.markForCheck();

                this.checkAndInitMerchantWallet();
            } else {
                // error
            }
        } catch (err) {
            this.logService.sendLog({code: '3.0.2', data: {error: err, gameparam: this.gameParams}});
            this.setError({
                msg: _get(err, 'errors[0]'),
            });
        } finally {
            waiter();
        }
    }

    protected checkLaunch(data: ILaunchInfo): boolean {
        if (!data) {
            return;
        }
        const checkDesktop = _isObject(data) &&
            _isString(data.gameHtml) &&
            !_includes(data.gameHtml, 'FAKESID');

        return this.configService.get<boolean>('appConfig.mobile') || checkDesktop;
    }


    /**
     * Set use or not mobile iframe
     */
    protected useOrNotMobileIframe(): void {
        if (this.realMobile && this.scriptCanBeRunInsideIframe()) {
            this.useMobileIframe = true;

            const excludeOptions: IExcludeMerchantSettings = this.configService.get(
                `$games.mobile.notRunInIframe.${this.game.merchantID}`) as IExcludeMerchantSettings;

            if (excludeOptions) {
                if (excludeOptions.launchCodes) {
                    this.useMobileIframe = !_find(excludeOptions.launchCodes, (code: string) => {
                        return this.gameParams.launchCode === code;
                    });
                } else {
                    this.useMobileIframe = false;
                }
            }
        }
    }

    /**
     * Run game in mobile iframe
     *
     * @returns {boolean}
     */
    protected runInMobileIframe(): boolean {
        let tryLoadIteration: number = 1,
            errorOccured: boolean = false;

        const waiter: TWaiter = this.logService.waiter({code: '3.0.10', data: {game: this.game}}),
            iframe: HTMLIFrameElement = this.document.createElement('iframe'),
            html: string = this.gameHtml;

        this.iframe = iframe;

        iframe.addEventListener('load', () => {
            if (errorOccured) {
                return;
            }

            tryLoadIteration++;
            try {
                const doc: HTMLDocument = (iframe.contentDocument) ?
                    iframe.contentDocument : iframe.contentWindow.document;

                const loadedMainSiteInIframe: boolean = tryLoadIteration == 4
                    && !!doc.querySelector('.wlc-application');
                if (loadedMainSiteInIframe) {
                    this.returnToPrevState();
                }

                if (tryLoadIteration > 4) {
                    this.gameScriptTimeout = setTimeout(() => {
                        errorOccured = true;
                        this.logService.sendLog({code: '3.0.9', data: {game: this.game}});
                        this.eventService.emit({
                            name: NotificationEvents.PushMessage,
                            data: <IPushMessageParams>{
                                type: 'error',
                                title: gettext('Game error'),
                                message: gettext('Something wrong. Please try later.'),
                                wlcElement: 'notification_game-error',
                            },
                        });
                    }, 500);
                } else {
                    doc.open();
                    doc.write(html);
                    doc.write(`<script>${this.launchInfo.gameScript}</script>`);
                    doc.close();
                    this.mobileIframeLoaded = true;
                }
                return true;
            } catch (error) {
                if (this.mobileIframeLoaded) {
                    waiter();
                }
                if (this.gameScriptTimeout) {
                    clearInterval(this.gameScriptTimeout);
                }
                return false;
            }
        });

        this.renderer.appendChild(this.gameContainer.nativeElement, iframe);
        return true;
    }

    /**
     * Checks whether or not the script can be run inside the iframe
     *
     * @returns {boolean}
     */
    protected scriptCanBeRunInsideIframe(): boolean {
        const substrs: string[] = [
            'window.location.replace',
            'window.location.href=',
            'params:base',
            'var:exitUrl',
        ];

        for (const substr of substrs) {
            if (_includes(this.launchInfo.gameScript, substr)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Set error
     *
     * @param {string | string[]} msgs
     * @param {string} title
     * @returns {ComponentRef<WlcModalComponent>}
     */
    protected setError(error: IError = {}): void {
        if (this.destroyed) {
            return;
        }

        this.modalService.showError({
            modalMessage: error.msg || gettext('Something wrong. Please try later.'),
            onModalHide: () => {
                setTimeout(() => {
                    this.closeGame();
                });
            },
        });
    }

    /**
     * Init event hanlers
     */
    protected initEventHandlers(): void {
        if (_isFunction(this.hooksByMerchant[this.gameParams.merchantId])) {
            this.hooksByMerchant[this.gameParams.merchantId]();
        }

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;
                this.isMobile ? this.addModifiers('mobile') : this.removeModifiers('mobile');
                this.setGameWindowSize();
                this.cdr.markForCheck();
            });

        this.gamesCatalogService.favoritesUpdated.pipe(
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.game = this.getGame();
            this.cdr.detectChanges();
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.cdr.markForCheck();

            if (this.router.globals.current.name === 'app.gameplay') {
                this.router.stateService.go('app.home').then(() => {
                    this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
                        common: {
                            game: this.game,
                            disableDemo: false,
                        },
                    });
                });
            }
        }, this.$destroy);

        this.eventService.subscribe({
            name: GameDashboardEvents.OPENED,
        }, () => {
            this.dashboardBtn.control.setValue(true);
            this.openDashboard = true;
            this.cdr.markForCheck();
        }, this.$destroy);

        this.eventService.subscribe({
            name: GameDashboardEvents.CLOSED,
        }, () => {
            this.dashboardBtn.control.setValue(false);
            this.openDashboard = false;
            this.cdr.markForCheck();
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.checkAndInitMerchantWallet();
            this.cdr.markForCheck();
        }, this.$destroy);

        fromEvent(this.window, 'closeGame')
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.closeGame();
            });

        fromEvent(this.window, 'message').pipe(
            map((message): IWlcPostMessage | boolean => {
                const data: string = _get(message, 'data');
                if (!_isString(data)) {
                    return false;
                }

                let msg: IWlcPostMessage;
                try {
                    msg = JSON.parse(data);
                } catch (error) {
                    return false;
                }
                return msg;
            }),
            filter((message: IWlcPostMessage | boolean): boolean => {
                return _get(message, 'event') === 'WLC_LOAD_STARTED';
            }),
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.closeGame();
        });
    }

    protected async checkAndInitMerchantWallet(): Promise<void> {
        if (this.isAuth && _includes(
            this.configService.get<number[]>('$games.merchantWallet.availableMerchants'),
            this.gameParams.merchantId,
        )) {
            this.isMerchantWallet = true;
            this.merchantWalletService = await this.injectionService
                .getService<MerchantWalletService>('games.merchant-wallet-service');
            this.merchantWalletService.startMerchantWalletGame(this.game);
        } else {
            this.isMerchantWallet = false;
        }
    }
}

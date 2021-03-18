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
    ComponentRef, AfterViewInit, Input,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {FormControl} from '@angular/forms';
import {ResizedEvent} from 'angular-resize-event';
import {UIRouter, RawParams} from '@uirouter/core';
import {fromEvent} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {
    ActionService,
    ConfigService,
    DeviceType,
    HooksService,
    IPushMessageParams,
    NotificationEvents,
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';
import {defaultParams, IGameWrapperCParams} from './game-wrapper.params';
import {IGameParams, ILaunchInfo} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {WlcModalComponent} from 'wlc-engine/modules/core/components/modal';
import {IPlayGameForRealCParams} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {ICustomGameParams} from 'wlc-engine/modules/games';
import * as GameDashboardParams from 'wlc-engine/modules/games/components/game-dashboard/game-dashboard.params';

import {
    includes as _includes,
    isObject as _isObject,
    isString as _isString,
    toNumber as _toNumber,
} from 'lodash-es';

interface IError {
    msg: string;
    state?: string;
    stateParams?: RawParams;
}

export const hooks = {
    launchInfo: 'launchInfo@GameWrapperComponent',
    evalScript: 'evalScript@GameWtapperComponent',
};

export interface IHookLaunchInfo {
    game: Game;
    launchInfo: ILaunchInfo;
    customGameParams: ICustomGameParams;
    demo: boolean;
}

export interface IHookEvalScript {
    game: Game;
    customGameParams: ICustomGameParams;
    disable: boolean;
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
    @ViewChild('gameContainer') gameContainer: ElementRef;

    @Input() public inlineParams: IGameWrapperCParams;

    public $params: IGameWrapperCParams;
    public game: Game;
    public gameHtml: string | HTMLIFrameElement = '';
    public useMobileIframe: boolean = false;
    public mobileIframeLoaded: boolean = false;
    public isReady: boolean;
    public locale: string;
    public gameParams: IGameParams;
    public isAuth: boolean;
    public openDashboard: boolean = true;
    public showDashboardBtn: boolean = false;
    public dashboardBtn = {
        name: 'game-dashboard',
        type: 'toggle',
        text: gettext('Dashboard'),
        textSide: 'left',
        control: new FormControl(),
        onChange: (checked: boolean) => {
            this.toggleDasgboard(checked);
        },
    };

    protected isMobile: boolean = false;
    protected realMobile: boolean = false;
    protected aspectRatio: string;
    protected aspectRatioCoefficient: number;
    protected launchInfo: ILaunchInfo;
    protected gameScriptTimeout: any;
    protected destroyed: boolean = false;
    protected containerObserver: MutationObserver;
    protected iframeObserver: MutationObserver;
    protected iframe: HTMLElement;
    protected isIframeHeight: boolean = false;

    constructor(
        public router: UIRouter,
        public userService: UserService,
        protected eventService: EventService,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected logService: LogService,
        @Inject('injectParams') protected injectParams: IGameWrapperCParams,
        protected elementRef: ElementRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected hostElement: ElementRef,
        protected hooksService: HooksService,
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
        this.locale = this.$params.gameParams?.lang || this.router.stateService.params?.locale || 'en';
        this.gameParams = this.getGameParams();
        this.initEventHandlers();

        this.game = this.gamesCatalogService.getGame(_toNumber(this.gameParams.merchantId), this.gameParams.launchCode);
        if (this.game) {
            // TODO: this.LocalCacheService.set('lastGameParams', this.gameParams);
            this.gamesCatalogService.loadFavourites();
            await this.openActiveGame();
            this.cdr.detectChanges();
            this.initStartResizeParams();
        } else {
            // TODO:  this.LocalCacheService.remove('lastGameParams');
            this.logService.sendLog({code: '3.0.4', data: {gameParams: this.gameParams}});
            this.setError({
                msg: gettext('The game does not exist or the game settings are incorrect'),
                state: 'app.home',
            });
        }
    }

    public ngAfterViewInit(): void {
        this.showDashboardBtn = true;
        this.initStartResizeParams();
        this.initFullPageIframeSize();
    }

    @HostListener('window:resize') onWResize() {
        if (this.$params) {
            this.setGameWindowSize();
        }
    }

    public onResize(event: ResizedEvent): void {
        this.setGameWindowSize(event.newWidth);
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
     * Open game on full screeen
     *
     * @param {Event} event
     */
    public openOnFullscreen(event?: Event): void {
        const container: HTMLElement = this.iframe ? this.iframe : this.wrp.element.nativeElement.querySelector('#egamings_container');
        if (container) {
            this.requestFullscreen(container);
            if (this.iframe) {
                const scrollAttr: string = this.iframe.getAttribute('scrolling');
                this.iframe.setAttribute('scrolling', 'auto');

                const fullScreenEvent = fromEvent(container, 'onfullscreenchange');
                const subscription = fullScreenEvent.subscribe((event) => {
                    if (!document.fullscreenElement) {
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
     *
     * @param {Event} event
     * @returns {Promise<void>}
     */
    public async toggleFavouriteBtn(event: Event): Promise<void> {
        if (!this.game) {
            return;
        }
        try {
            await this.gamesCatalogService.toggleFavourites(this.game.ID);
        } catch (error) {
        }
    }

    public onClose(event: Event): void {
        // TODO: this.LocalCacheService.remove('lastGameParams');
        this.returnToPrevState();
    }

    public ngOnDestroy(): void {
        this.containerObserver?.disconnect();
        if (this.iframeObserver) {
            this.iframeObserver?.disconnect();
        }
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
        if (this.$params.theme === 'fullscreen-game-frame' && this.hostElement) {
            this.containerObserver = new MutationObserver(() => {
                const iframe = document.querySelector('#egamings_container iframe');
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
        if (this.hostElement?.nativeElement) {
            const elem = this.hostElement.nativeElement;
            const iframe = this.wrp?.element?.nativeElement.querySelector('iframe');

            let height: string = (globalThis.innerHeight - elem.offsetTop) + 'px';

            const iframeHeightAttr: string = iframe?.getAttribute('height');
            if (_includes(iframeHeightAttr, 'px') && height && !this.$params.gameParams?.disableIframeAutoResize) {
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
                this.iframe = iframe;
                const iframeAttrHeight = this.iframe.getAttribute('height');
                if (iframeAttrHeight && iframeAttrHeight !== '100%') {
                    this.isIframeHeight = true;
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

        this.iframeObserver.observe(this.iframe[0], {
            childList: true,
            subtree: true,
            attributes: true,
        });
    }

    protected setGameWindowSize(width?: number): void {
        if (this.$params.theme !== 'default') {
            this.setFullPageIframeSize();
            return;
        }

        const el = this.wrp?.element?.nativeElement;
        const maxHeight: number = this.getMaxHeight();
        if (!width) {
            width = this.wrp?.element?.nativeElement.parentElement.getBoundingClientRect().width;
        }

        if (this.aspectRatioCoefficient && width) {
            let elementHeight: number = width / this.aspectRatioCoefficient,
                elementNewWidth: number = 0;

            if (elementHeight > maxHeight) {
                elementHeight = maxHeight;
            }

            elementNewWidth = elementHeight * this.aspectRatioCoefficient;

            this.renderer.setStyle(el, 'height', elementHeight + 'px');
            this.renderer.setStyle(el, 'maxWidth', elementNewWidth + 'px');
            // this.renderer.setStyle(this.header.nativeElement, 'maxWidth', elementNewWidth + 'px');
            this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', elementNewWidth + 'px');
        } else {
            this.renderer.setStyle(el, 'height', '100%');
            this.renderer.setStyle(el, 'maxWidth', '100%');
            // this.renderer.setStyle(this.header.nativeElement, 'maxWidth', '100%');
            this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', '100%');
        }

        if (this.isIframeHeight) {
            this.renderer.setStyle(el, 'height', _toNumber(this.iframe.getAttribute('height')));
        }
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
        const windowHeight = globalThis.innerHeight;
        const wrpElTop = this.wrp?.element?.nativeElement.getBoundingClientRect().top;
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
        if (document.fullscreenEnabled) {
            element.requestFullscreen();
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
            this.gamesCatalogService.loadFavourites();
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
        };
    }

    protected async openActiveGame(): Promise<boolean> {
        try {
            await this.getLaunchParams();
            this.isReady = true;
            this.cdr.detectChanges();

            if (this.useMobileIframe) {
                return this.runInMobileIframe();
            } else if (this.launchInfo.gameScript) {
                try {
                    if (this.configService.get<boolean>('appConfig.mobile')) {
                        // this.LocalCacheService.set('redirectAfterGame',
                        //     _get(this.$rootScope, 'previousState.state.name') || 'app.home');
                    }

                    this.gameScriptTimeout = setTimeout(async () => {
                        if (this.destroyed) {
                            return;
                        }

                        const result = await this.hooksService.run<IHookEvalScript>(hooks.evalScript, {
                            game: this.game,
                            customGameParams: this.$params?.gameParams,
                            disable: false,
                        });
                        if (!result.disable) {
                            eval(this.launchInfo.gameScript);
                        }
                    });
                    return true;
                } catch (ex) {
                    // setError()
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    /**
     * Get launch params
     *
     * @returns {Promise<void>}
     */
    protected async getLaunchParams(): Promise<void> {
        const waiter = this.logService.waiter({code: '3.0.3'});
        try {
            const launchInfo: ILaunchInfo = await this.gamesCatalogService.getLaunchParams(this.gameParams);

            const result = await this.hooksService.run<IHookLaunchInfo>(hooks.launchInfo, {
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
                this.gameHtml = this.domSanitizer.bypassSecurityTrustHtml(launchInfo.gameHtml)?.['changingThisBreaksApplicationSecurity'];
                this.cdr.markForCheck();
            } else {
                // error
            }
        } catch (err) {
            this.logService.sendLog({code: '3.0.2', data: {error: err, gameparam: this.gameParams}});
            this.setError({
                msg: err.errors,
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

        if (this.$params.theme !== 'fullscreen-game-frame' && this.isMobile) {
            this.useMobileIframe = true;
        }
        this.cdr.detectChanges();
        // const runInIframeOnly: boolean = this.configService.get('siteconfig.game.mobile.runInIframeOnly');
        // if (runInIframeOnly) {
        //     this.useMobileIframe = true;
        //
        //     const excludeOptions: IExcludeMerchantSettings = this.configService.get(
        //         `siteconfig.game.mobile.notRunInIframe.${this.game.merchantID}`) as IExcludeMerchantSettings;
        //     if (!excludeOptions) {
        //         return;
        //     }
        //
        //     if (excludeOptions.launchCodes) {
        //         for (const launchCode of excludeOptions.launchCodes) {
        //             if (this.gameParams.launchCode == launchCode) {
        //                 this.useMobileIframe = false;
        //                 return;
        //             }
        //         }
        //     } else {
        //         this.useMobileIframe = false;
        //     }
        //     return;
        // }
        // this.useMobileIframe = false;
    }

    /**
     * Run game in mobile iframe
     *
     * @returns {boolean}
     */
    protected runInMobileIframe(): boolean {
        let tryLoadIteration: number = 1,
            errorOccured: boolean = false;

        const waiter = this.logService.waiter({code: '3.0.10', data: {game: this.game}});

        if (this.scriptCanBeRunInsideIframe()) {
            const iframe: HTMLIFrameElement = document.createElement('iframe'),
                html: string = this.gameHtml as string;
            this.iframe = iframe;

            iframe.addEventListener('load', () => {
                if (errorOccured) {
                    return;
                }

                tryLoadIteration++;
                try {
                    const doc: HTMLDocument = (iframe.contentDocument) ?
                        iframe.contentDocument : iframe.contentWindow.document;

                    const loadedMainSiteInIframe: boolean = tryLoadIteration == 4 && !!doc.querySelector('.wlc-application');
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
        } else {
            eval(this.launchInfo.gameScript);
            this.mobileIframeLoaded = true;
            waiter();
        }
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
    protected setError(error: IError): void {
        this.modalService.showError({
            modalMessage: error.msg || gettext('Something wrong. Please try later.'),
            onModalHide: () => {
                this.router.stateService.go(error.state || 'app.home', error.stateParams || {});
            },
        });
    }

    /**
     * Init event hanlers
     */
    protected initEventHandlers(): void {
        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;
                this.isMobile ? this.addModifiers('mobile') : this.removeModifiers('mobile');
                this.cdr.markForCheck();
            });

        this.gamesCatalogService.favoritesUpdated.pipe(
            takeUntil(this.$destroy),
        ).subscribe(() => {
            this.game = this.gamesCatalogService.getGame(this.gameParams.merchantId, this.gameParams.launchCode);
            this.cdr.detectChanges();
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.cdr.markForCheck();

            this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
                common: {
                    game: this.game,
                    disableDemo: false,
                },
            });
            this.router.stateService.go('app.home');
        }, this.$destroy);

        this.eventService.subscribe({
            name: GameDashboardParams.Events.OPENED,
        }, () => {
            this.dashboardBtn.control.setValue(true);
            this.openDashboard = true;
            this.cdr.markForCheck();
        }, this.$destroy);

        this.eventService.subscribe({
            name: GameDashboardParams.Events.CLOSED,
        }, () => {
            this.dashboardBtn.control.setValue(false);
            this.openDashboard = false;
            this.cdr.markForCheck();
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.cdr.markForCheck();
        }, this.$destroy);
    }
}

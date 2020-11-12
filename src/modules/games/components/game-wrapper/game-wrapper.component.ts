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
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ResizedEvent} from 'angular-resize-event';
import {UIRouter} from '@uirouter/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {Game} from 'wlc-engine/modules/games/models/game.model';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {ConfigService} from 'wlc-engine/modules/core';
import {defaultParams,IGWParams} from './game-wrapper.params';
import {IGameParams, ILaunchInfo} from '../../interfaces/games.interfaces';
import {UserService} from '../../../user/services/user.service';
import {LogService} from 'wlc-engine/modules/core/services';

import {
    includes as _includes,
    isObject as _isObject,
    isString as _isString,
    toNumber as _toNumber,
} from 'lodash';

@Component({
    selector: '[wlc-game-wrapper]',
    templateUrl: './game-wrapper.component.html',
    styleUrls: ['./styles/game-wrapper.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GameWrapperComponent extends AbstractComponent implements OnInit, OnDestroy {
    @ViewChild('wrp', {read: ViewContainerRef, static: false}) wrp: ViewContainerRef;
    @ViewChild('header') header: ElementRef;
    @ViewChild('footer') footer: ElementRef;

    public $params: IGWParams;
    public game: Game;
    public gameHtml: string | HTMLIFrameElement = '';
    public isFavourite: boolean;
    public useMobileIframe: boolean;
    public isReady: boolean;
    public locale: string;

    protected aspectRatio: string;
    protected aspectRatioCoefficient: number;

    protected gameParams: IGameParams;
    protected launchInfo: ILaunchInfo;

    protected gameScriptTimeout: number;
    protected destroyed: boolean = false;

    protected containerObserver: MutationObserver;
    protected iframeObserver: MutationObserver;
    protected iframe: HTMLElement;

    protected isIframeHeght: boolean = false;

    constructor(
        public router: UIRouter,
        protected gamesCatalogService: GamesCatalogService,
        protected userService: UserService,
        protected configService: ConfigService,
        protected logService: LogService,
        @Inject('injectParams') protected injectParams: IGWParams,
        protected elementRef: ElementRef,
        protected domSanitizer: DomSanitizer,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
    ) {
        super({injectParams, defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.locale = this.$params.gameParams?.lang || this.router.stateService.params?.locale || 'en';
        this.gameParams = this.getGameParams();
        // TODO это временно запихнуто
        await this.gamesCatalogService.load();

        this.game = this.gamesCatalogService.getGame(this.gameParams.merchantId, this.gameParams.launchCode); // TODO || getGameById
        if (this.game) {
            // TODO: this.LocalCacheService.set('lastGameParams', this.gameParams);
            await this.openActiveGame();
            this.isFavourite = await this.checkFavorite();
            this.isReady = true;
            this.cdr.detectChanges();
            this.initStartResizeParams();
        } else {
            // TODO:  this.LocalCacheService.remove('lastGameParams');
            // TODO:  setError()
        }
    }

    @HostListener('window:resize') onWResize() {
        if (this.$params) {
            this.setGameWindowSize();
        }
    }

    public onResize(event: ResizedEvent): void {
        this.setGameWindowSize(event.newWidth);
    }

    public onFullscreen(event: Event): void {
        if (this.iframe) {
            this.requestFullscreen(this.iframe);
        }
    }

    public async onFavourite(event: Event): Promise<void> {
        if (!this.game) {
            return;
        }
        try {
            // TODO: const result: {favorite: boolean} = await this.FavoriteGamesService.addRemoveFavorites(this.game);
            // TODO: this.isFavourite = !!result.favorite;
            this.isFavourite = !this.isFavourite;
        } catch (error) {
            //
        }
    }

    public onClose(event: Event): void {
        // TODO: this.LocalCacheService.remove('lastGameParams');
        this.returnToPrevState();
    }

    public ngOnDestroy(): void {
        this.containerObserver.disconnect();
        if (this.iframeObserver) {
            this.iframeObserver.disconnect();
        }
    }

    protected initStartResizeParams():void {
        this.aspectRatio = this.game.AR || 'auto';
        this.aspectRatioCoefficient = this.getAspectRatioCoefficient();
        this.checkIframe();
    }

    protected checkIframe(): void {
        this.containerObserver = new MutationObserver(() => {
            const iframe = this.wrp?.element?.nativeElement.querySelector('iframe');
            if (iframe) {
                this.iframe = iframe;
                const iframeAttrHeight = this.iframe.getAttribute('height');
                if (iframeAttrHeight && iframeAttrHeight !== '100%') {
                    this.isIframeHeght = true;
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
        const el = this.wrp?.element?.nativeElement;
        const maxHeight:number = this.getMaxHeight();
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
            this.renderer.setStyle(this.header.nativeElement, 'maxWidth', elementNewWidth + 'px');
            this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', elementNewWidth + 'px');
        } else {
            this.renderer.setStyle(el, 'height', '100%');
            this.renderer.setStyle(el, 'maxWidth', '100%');
            this.renderer.setStyle(this.header.nativeElement, 'maxWidth', '100%');
            this.renderer.setStyle(this.footer.nativeElement, 'maxWidth', '100%');
        }

        if (this.isIframeHeght) {
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
        const windowHeight = window.window.innerHeight;
        const wrpElTop = this.wrp?.element?.nativeElement.getBoundingClientRect().top;
        const padding = this.$params?.padding || 0;
        const elFooterHeight = this.footer.nativeElement.getBoundingClientRect().height;
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
     * Check favorite or not
     *
     * @returns {Promise<boolean>}
     */
    protected async checkFavorite(): Promise<boolean> {
        if (!this.game || !this.userService.isAuthenticated) {
            return false;
        }
        try {
            // @TODO After creating FavoriteGamesService
            //const result: IFavoriteGame[] = await this.FavoriteGamesService.getFavorites();
            // return _findIndex(result, ['game_id', this.game.ID]) !== -1;
            return false;
        } catch (error) {
            this.logService.sendLog({code: '3.0.13', data: {error}});
            return false;
        }
    }

    /**
     * Get game params
     *
     * @returns {IGameParams}
     */
    protected getGameParams(): IGameParams {
        return {
            merchantId: this.$params.gameParams?.merchantId || this.router.stateService.params?.merchantId || '', // TODO: get from state
            launchCode: this.$params.gameParams?.launchCode || this.router.stateService.params?.launchCode || '', // TODO: get from state
            lang: this.locale,
            demo: this.router.stateService.params?.demo ? 1 : 0, // TODO: get from state
            gameId: this.$params.gameParams?.gameId || this.router.stateService.params?.gameId || 'none', // TODO: get from state
        };
    }

    protected async openActiveGame(): Promise<boolean> {
        try {
            await this.getLaunchParams();
            if (this.useMobileIframe) {
                // return this.runInMobileIframe();
                return false;
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

                        // const result = // check disable
                        const result = {disable: false};
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

    protected async getLaunchParams(): Promise<void> {
        try {
            //  TODO: const launchInfo: ILaunchInfo = await this.GamesService.getLaunchParams(this.gameParams);

            // PARAMS FOR CONFIG:
            // launchCode: 'hottestfruits40'
            // merchantId: '975'
            // TODO to remove mock data
            const launchInfo: ILaunchInfo = {
                config: {AuthToken: 'freeplay', AR: '16:9'},
                gameHtml: `<div id="egamings_container">
<iframe scrolling="no" src="https://cdn02.cdn.amatic.com/gmsl/amanet/game.html?game=
hottestfruits40&amp;hash=freeplay&amp;language=en&amp;currency=EUR&amp;config=1352&amp;
isFreeplay=true" width="100%" height="100%" frameBorder="0" marginheight="0" marginwidth="0" allowfullscreen>
</iframe>
</div>`,
                gameScript: '',
                merchant: 'amaticdirect',
                merchantId: '975',
                mobilePlatform: false,
            };
            if (this.checkLaunch(launchInfo)) {
                // this.launchInfo.gameScript = await this.getGameScript(this.launchInfo.gameScript);
                if (this.configService.get<boolean>('appConfig.mobile')) {
                    // TODO
                }
                this.gameHtml = this.domSanitizer.bypassSecurityTrustHtml(launchInfo.gameHtml)?.['changingThisBreaksApplicationSecurity'];
                this.cdr.markForCheck();
            } else {
                // error
            }
        } catch(e) {
            // TODO set error
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

}

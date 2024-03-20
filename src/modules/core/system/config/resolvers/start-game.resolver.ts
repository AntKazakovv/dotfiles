import {
    StateService,
    UIRouter,
    Transition,
    RawParams,
    ResolveTypes,
    StateObject,
} from '@uirouter/core';

import {
    BehaviorSubject,
    firstValueFrom,
    Subscription,
} from 'rxjs';
import {first} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _find from 'lodash-es/find';
import _clone from 'lodash-es/clone';
import _reduce from 'lodash-es/reduce';
import _includes from 'lodash-es/includes';
import _union from 'lodash-es/union';
import _toNumber from 'lodash-es/toNumber';
import _isEmpty from 'lodash-es/isEmpty';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {
    LogService,
    TWaiter,
} from 'wlc-engine/modules/core/system/services/log/log.service';
import {StateHistoryService} from 'wlc-engine/modules/core/system/services/state-history/state-history.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IFreeRound} from 'wlc-engine/modules/core/system/interfaces/loyalty.interface';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {
    Game,
    GamesFilterService,
    IDisablePlayRealByCountry,
    IGamesFilterData,
    IPlayGameForRealCParams,
    GamesCatalogService,
} from 'wlc-engine/modules/games';
import {UserInfo} from 'wlc-engine/modules/user';
import {AppType} from 'wlc-engine/modules/core/system/interfaces/base-config/app.interface';
import {BaseGamesHandler} from './games-handler.base';
import {Games} from 'wlc-engine/modules/games/system/classes/games';

export interface IHookGameStartData {
    game: Game;
    demo: boolean;
    result: Deferred<unknown>;
}

export enum RejectReason {
    RealPlayDisabled,
    GameNotFounded,
    GameHasNoDemo,
    GamesCatalogNotReady,
    RestrictedByActiveBonuses,
    LowBalance,
    EmptyRequiredFields,
    StateChangeStart,
    AuthRequired,
}

export const startGameResolver: ResolveTypes = {
    token: 'startGame',
    deps: [
        ConfigService,
        LogService,
        StateService,
        UIRouter,
        ModalService,
        Transition,
        EventService,
        InjectionService,
        StateHistoryService,
        HooksService,
    ],
    resolveFn: (
        configService: ConfigService,
        logService: LogService,
        stateService: StateService,
        router: UIRouter,
        modalService: ModalService,
        transition: Transition,
        eventService: EventService,
        injectionService: InjectionService,
        stateHistoryService: StateHistoryService,
        hooksService: HooksService,
    ) => {
        return new StartGameHandler(
            configService,
            logService,
            stateService,
            router,
            modalService,
            transition,
            eventService,
            injectionService,
            stateHistoryService,
            hooksService,
        ).result.promise;
    },
};

class StartGameHandler extends BaseGamesHandler {
    public result = new Deferred();
    protected isDemo: boolean = false;
    protected authenticated: boolean = false;
    protected realPlayDisabled: boolean = false;
    protected realPlayDisabledByCountry: boolean = false;
    protected checkProfileRequiredFields: boolean = false;
    protected game: Game;
    protected filterCacheCleared$ = new Deferred();
    protected gamesCatalogService: GamesCatalogService;
    protected gamesFilterService: GamesFilterService;
    protected merchantsWithOwnWallet: number[];
    protected previousState: StateObject;

    constructor(
        configService: ConfigService,
        protected logService: LogService,
        protected stateService: StateService,
        protected router: UIRouter,
        modalService: ModalService,
        transition: Transition,
        protected eventService: EventService,
        injectionService: InjectionService,
        protected stateHistoryService: StateHistoryService,
        protected hooksService: HooksService,
    ) {
        super(
            configService,
            modalService,
            transition,
            injectionService,
        );
    }

    protected override async init(): Promise<void> {
        await super.init();

        this.modalProfileInfo.onModalHide = () => {
            if (!this.router.globals.current.name) {
                this.stateService.go('app.home', this.transition.params());
            }
        };

        const params = this.transition.params();
        if (!_isEmpty(params.demo) && params.demo !== 'true') {
            this.stateService.go(this.transition.to(), _assign({}, params, {demo: null}));
            return;
        }

        const waiter: TWaiter = this.logService.waiter({code: '3.0.11'}, 7000);

        await this.configService.ready;
        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        this.gamesFilterService = await this.injectionService
            .getService<GamesFilterService>('games.games-filter-service');

        try {
            await this.gamesCatalogService.ready;
        } catch (err) {
            // TODO Change error code
            this.logService.sendLog({
                code: '3.0.0',
                data: err,
                flog: {
                    from: 'StartGameHandler',
                },
            });
            this.result.reject(RejectReason.GamesCatalogNotReady);
            return;
        } finally {
            waiter();
        }

        this.prepare();

        this.previousState = this.transition.$from();

        if (!this.checksForPlayReal() || !await this.checkGame()) {
            return;
        }

        const res = await this.hooksService.run<IHookGameStartData>('beforeStartGame', {
            game: this.game,
            result: this.result,
            demo: this.isDemo,
        });

        if (res.result.status !== 'pending') {
            return;
        }

        if (this.authenticated) {
            this.checksForAuthenticated();
        } else {
            this.checksForUnauthorized();
        }
        //this.result.resolve();
    }

    /**
     * Prepare actions
     */
    private prepare(): void {
        const checkOnRunWaiter = this.logService.durationWaiter({
            code: '3.0.27',
            data: {
                merchantId: this.transition.params().merchantId,
                launchCode: this.transition.params().launchCode,
            },
        });
        this.logService.sendLog({
            code: '3.0.29',
            data: {
                merchantId: this.transition.params().merchantId,
                launchCode: this.transition.params().launchCode,
            },
        });

        this.result.promise.catch((reason) => {
            this.logService.sendLog({
                code: '3.0.26',
                data: {
                    merchantId: this.transition.params().merchantId,
                    launchCode: this.transition.params().launchCode,
                },
            });

            if (reason === RejectReason.GameNotFounded) {
                this.stateService.go('app.error', {
                    locale: this.configService.get('currentLanguage'),
                });
            }
        });

        this.result.promise.then(() => {
            const gameStartHandler: Function = this.router.transitionService.onSuccess({}, () => {
                gameStartHandler();
                const closeSubscription: Subscription = this.closeGameHandler();
                const gameClosedHandler: Function = this.router.transitionService.onStart({}, () => {
                    this.gamesFilterService.toClearCache$.subscribe((value: boolean) => {
                        if (value) {
                            this.gamesFilterService.filterCache.modal = null;
                        }

                        gameClosedHandler();
                        closeSubscription.unsubscribe();
                        this.filterCacheCleared$.resolve();
                    });
                });
            });

        });

        const stateChangeHandler = this.router.transitionService.onStart({}, () => {
            this.result.reject(RejectReason.StateChangeStart);
            this.logService.sendLog({
                code: '3.0.28',
                data: {
                    merchantId: this.transition.params().merchantId,
                    launchCode: this.transition.params().launchCode,
                },
            });
            stateChangeHandler();
        });

        this.result.promise.finally(() => {
            checkOnRunWaiter.resolve();
            stateChangeHandler();
        });

        this.authenticated = this.configService.get<boolean>('$user.isAuthenticated');
        this.isDemo = this.transition.params().demo === 'true';
        this.realPlayDisabled = !!(this.configService.get<boolean>('$games.realPlay.disable')
            || this.configService.get<boolean>('appConfig.siteconfig.RestrictMoneyGames'));
        this.checkProfileRequiredFields = this.configService.get<boolean>('$games.run.checkProfileRequiredFields');
        this.merchantsWithOwnWallet = this.configService.get<number[]>('$games.merchantWallet.availableMerchants');
        this.setRealPlayDisabledByCountry();
    }

    private setRealPlayDisabledByCountry(): void {
        const realPlayDisableByCountry: IDisablePlayRealByCountry = this.configService
            .get('$games.realPlay.disableByCountry');
        const counryListDefault: string[] = realPlayDisableByCountry.default || [];

        let counryListMerchant: string[] = [];
        if (realPlayDisableByCountry.forMerchant?.[this.merchantId]) {
            counryListMerchant = _reduce(
                realPlayDisableByCountry.forMerchant, (res, countryList: string[], merchantId) => {
                    return this.gamesCatalogService.getMerchantById(_toNumber(merchantId))
                        ? _union(res, countryList)
                        : res;
                }, []);
        }
        const countries: string[] = _union(counryListDefault, counryListMerchant);

        this.realPlayDisabledByCountry = _includes(countries, this.configService.get<string>('appConfig.country'));
    }

    /**
     * Checks for play real
     *
     * @returns {boolean}
     */
    private checksForPlayReal(): boolean {
        if (!this.isDemo && (this.realPlayDisabled || this.realPlayDisabledByCountry)) {
            let message: string;

            if (this.realPlayDisabled) {
                message = gettext('Sorry, gambling is not possible');
            } else if (this.realPlayDisabledByCountry) {
                message = gettext('Play for real is disabled in your country');
            }

            this.showErrorNotification(message);

            this.result.reject(RejectReason.RealPlayDisabled);
            if (this.stateService.current.abstract || this.stateService.current.name === 'app.gameplay') {
                this.stateService.go('app.home', this.transition.params());
            } else {
                this.stateService.go(this.stateService.current.name, this.transition.params(), {reload: false});
            }
            return false;
        }
        return true;
    }

    /**
     * Check game
     *
     * @returns {boolean}
     */
    private async checkGame(): Promise<boolean> {
        this.game = this.gamesCatalogService.getGame(
            _toNumber(this.transition.params().merchantId),
            this.transition.params().launchCode,
            false,
            true,
        );

        if (!this.game) {
            this.logService.sendLog({code: '3.0.1', data: this.stateService.params});
            this.showErrorNotification(
                gettext('For some reason the game is no longer available'),
                gettext('Game not found'),
            );
            this.stateService.go('app.home', this.transition.params());
            this.result.reject(RejectReason.GameNotFounded);
            return false;
        }
        if (this.isDemo) {
            if (this.game.hasDemo) {
                this.result.resolve();
                return true;
            }

            this.showErrorNotification(
                gettext('This game has no demo mode. You will be redirected to normal mode'),
                gettext('Game has no demo!'),
            );

            this.result.reject(RejectReason.GameHasNoDemo);

            const stateParams: RawParams = _clone(this.transition.params());
            stateParams.demo = null;
            this.stateService.go(GlobalHelper.isMobileApp() ? 'app.run-game' : 'app.gameplay', stateParams);

            return false;
        }
        return true;
    }

    /**
     * Checks for authenticated users
     */
    private async checksForAuthenticated(): Promise<void> {
        if (this.isDemo) {
            this.result.resolve();
            return;
        }

        await this.configService.ready;

        const bonusesService = await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');

        const activeBonuses: Bonus[] = await bonusesService.queryBonuses<Bonus>(true, 'active');

        if (activeBonuses && this.gameRestrictedByActiveBonuses(this.game, activeBonuses)) {
            this.showErrorNotification(gettext('Sorry, this game is disabled with an active bonus'));

            this.result.reject(RejectReason.RestrictedByActiveBonuses);
            this.stateService.go('app.home', this.transition.params(), {reload: false});
            return;
        }

        try {
            if (this.checkProfileRequiredFields) {
                await this.checkUserFields();
            }
            await this.checkUserBalance();
            this.result.resolve();
        } catch (err) {
            this.result.reject(err);
        }
    }

    /**
     * Checks for unauthorized users
     */
    private checksForUnauthorized(): void {
        if (!this.isDemo) {
            this.stateService.go('app.home', this.transition.params()).finally(() => {

                this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
                    common: {
                        game: this.game,
                        disableDemo: false,
                        isLatestBetsWidget: false,
                    },
                });
            });
            this.result.reject(RejectReason.AuthRequired);
        } else {
            this.result.resolve();
        }
    }

    /**
     * Check user balanse
     *
     * @returns {Promise}
     */
    private async checkUserBalance(): Promise<void> {
        await this.configService.ready;
        const deferred = new Deferred<void>();
        const skipCheckBalance: boolean = this.configService.get<boolean>('$games.run.skipCheckBalance');
        const isKiosk: boolean = this.configService.get<AppType>('$base.app.type') === 'kiosk';

        if (skipCheckBalance || isKiosk) {
            deferred.resolve();
            return deferred.promise;
        }

        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );

        const isMultiWallet: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
        const isResolveBalance: Function = (): boolean => {

            if (Games.allowGameCurrency) {

                if (isMultiWallet) {

                    return !!userInfo.getWalletBalance(
                        GamesCatalogService.userService.userProfile.extProfile.currentWallet?.walletCurrency,
                    ) || (!!userInfo.wallets[
                        GamesCatalogService.userService.userProfile.extProfile.currentWallet?.walletCurrency
                    ] && !!userInfo.bonusBalance);

                } else {
                    return !!userInfo.balance;
                }

            } else {
                return !!userInfo.balance || !!userInfo.bonusBalance;
            }
        };

        if (isResolveBalance()) {
            deferred.resolve();
            return deferred.promise;
        }

        const merchantFreeRound = _find(userInfo.freeRounds, (freeRound: IFreeRound): boolean => {
            return ((this.game.merchantID === +freeRound.IDMerchant) ||
                    (this.game.subMerchantID === +freeRound.IDMerchant))
                && +freeRound.Count
                && freeRound.Games.includes(this.game.launchCode);
        });

        if (merchantFreeRound || _includes(this.merchantsWithOwnWallet, this.merchantId)) {
            deferred.resolve();
            return deferred.promise;
        }

        deferred.reject(RejectReason.LowBalance);
        const redirect: IRedirect = this.configService.get<IRedirect>('$base.redirects.zeroBalance');

        if (redirect.modalInsteadRedirect) {
            this.modalService.showModal(redirect.modalInsteadRedirect, {game: this.game});
        } else {
            this.showErrorNotification(
                gettext('Deposit more money to play this game.'),
                gettext('Insufficient balance'),
            );

            if (this.configService.get('$finances.fastDeposit.use')) {
                //@TODO After ready fast deposit
                //this.modalService.showModal('fastDeposit');
            } else {
                this.stateService.go(redirect.state, redirect?.params || this.transition.params());
            }
        }

        return deferred.promise;
    }

    /**
     * Check active bonus restriction
     *
     * @param game
     * @param activeBonuses
     * @returns {boolean}
     */
    private gameRestrictedByActiveBonuses(game: Game, activeBonuses: Bonus[]): boolean {
        if (this.isDemo || !this.configService.get<boolean>('$games.run.checkActiveBonusRestriction')) {
            return false;
        }
        return game.restrictedByBonuses(activeBonuses);
    }

    private showErrorNotification(
        message: string,
        title: string = gettext('Game launch error'),
        dismissTime: number = 5000,
    ): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: 'notification_game-launch-error',
                dismissTime,
            },
        });
    }

    private closeGameHandler(): Subscription {
        const filterCache: null | IGamesFilterData =
            _isEmpty(this.gamesFilterService.filterCache.modal) ? null
                : {...this.gamesFilterService.filterCache.modal};

        const closeGameSubscription$: Subscription = this.eventService.subscribe(
            {name: 'CLOSE_GAME'},
            () => {
                if (!this.previousState.name) {
                    this.router.stateService.go('app.home');
                    return;
                }

                const lastStateNotGamePlay = this.stateHistoryService.lastNotGamePlayState;
                if (lastStateNotGamePlay) {
                    this.router.stateService.go(lastStateNotGamePlay.state, lastStateNotGamePlay.params);
                } else {
                    this.router.stateService.go('app.home');
                }

                if (filterCache) {
                    this.filterCacheCleared$.promise.then(() => {
                        this.gamesFilterService.filterCache.modal = filterCache;
                        this.eventService.emit({
                            name: 'SHOW_MODAL',
                            data: 'search',
                        });
                    });
                }
            },
        );
        return closeGameSubscription$;
    }
}

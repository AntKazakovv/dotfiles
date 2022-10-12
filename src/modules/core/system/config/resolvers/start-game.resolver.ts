'use strict';

import {Inject} from '@angular/core';
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
import _find from 'lodash-es/find';
import _clone from 'lodash-es/clone';
import _reduce from 'lodash-es/reduce';
import _includes from 'lodash-es/includes';
import _union from 'lodash-es/union';
import _toNumber from 'lodash-es/toNumber';
import _uniqWith from 'lodash-es/uniqWith';
import _isEmpty from 'lodash-es/isEmpty';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isEqual from 'lodash-es/isEqual';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {
    LogService,
    TWaiter,
} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IFreeRound} from 'wlc-engine/modules/core/system/interfaces/loyalty.interface';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {IPrevState} from 'wlc-engine/modules/core/system/services/state-history/state-history.service';
import {
    Game,
    GamesFilterService,
    IDisablePlayRealByCountry,
    IGamesFilterData,
    IPlayGameForRealCParams,
    MerchantFieldsService,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    UserInfo,
    IAddProfileInfoCParams,
    UserHelper,
} from 'wlc-engine/modules/user';
import {AddProfileInfoComponent} from 'wlc-engine/modules/user/components/add-profile-info';
import {FormElements} from 'wlc-engine/modules/core/system/config/form-elements';
import {IFormComponent} from 'wlc-engine/modules/core/components/form-wrapper/form-wrapper.component';
import {HooksService} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';
import {StateHistoryService} from 'wlc-engine/modules/core/system/services/state-history/state-history.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {CuracaoRequirement} from 'wlc-engine/modules/app/system';

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
        CuracaoRequirement,
        ConfigService,
        LogService,
        StateService,
        UIRouter,
        ModalService,
        Transition,
        EventService,
        InjectionService,
        GamesFilterService,
        StateHistoryService,
        HooksService,
        ActionService,
    ],
    resolveFn: (
        enableRequirement: boolean,
        configService: ConfigService,
        logService: LogService,
        stateService: StateService,
        router: UIRouter,
        modalService: ModalService,
        transition: Transition,
        eventService: EventService,
        injectionService: InjectionService,
        gamesFilterService: GamesFilterService,
        stateHistoryService: StateHistoryService,
        hooksService: HooksService,
        actionService: ActionService,
    ) => {
        return new StartGameHandler(
            enableRequirement,
            configService,
            logService,
            stateService,
            router,
            modalService,
            transition,
            eventService,
            injectionService,
            gamesFilterService,
            stateHistoryService,
            hooksService,
            actionService,
        ).result.promise;
    },
};

class StartGameHandler {
    public result = new Deferred();
    private isDemo: boolean = false;
    private authenticated: boolean = false;
    private realPlayDisabled: boolean = false;
    private realPlayDisabledByCountry: boolean = false;
    private checkProfileRequiredFields: boolean = false;
    private merchantId: number;
    private game: Game;
    private filterCacheCleared$ = new Deferred();
    private gamesCatalogService: GamesCatalogService;
    private merchantFieldsService: MerchantFieldsService;
    private merchantsWithOwnWallet: number[];
    private previousState: StateObject;

    constructor(
        @Inject(CuracaoRequirement) protected enableRequirement: boolean,
        private configService: ConfigService,
        private logService: LogService,
        private stateService: StateService,
        private router: UIRouter,
        private modalService: ModalService,
        private transition: Transition,
        private eventService: EventService,
        private injectionService: InjectionService,
        private gamesFilterService: GamesFilterService,
        private stateHistoryService: StateHistoryService,
        private hooksService: HooksService,
        private actionService: ActionService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        const waiter: TWaiter = this.logService.waiter({code: '3.0.11'}, 7000);

        await this.configService.ready;
        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        this.merchantFieldsService = await this.injectionService
            .getService<MerchantFieldsService>('games.merchant-fields-service');

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

        if (this.previousState.name !== 'app.gameplay') {

            const prevStateToSave: IPrevState = {
                state: this.previousState,
                params: this.transition.params('from'),
            };
            this.stateHistoryService.lastNotGamePlayState = prevStateToSave;
        }

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
                            this.gamesFilterService.filterCache = null;
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
        this.merchantId = _toNumber(this.transition.params().merchantId);
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
                gettext('Dear Client, this game has no demo mode, you will be redirected to normal mode.'),
                gettext('Game has no demo!'),
            );

            this.result.reject(RejectReason.GameHasNoDemo);
            const stateParams: RawParams = _clone(this.transition.params());
            stateParams.demo = false;
            this.stateService.go('app.gameplay', stateParams);
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
    private checksForUnauthorized() {
        if (!this.isDemo) {
            this.stateService.go('app.home', this.transition.params()).finally(() => {

                this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
                    common: {
                        game: this.game,
                        disableDemo: false,
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
        const deferred = new Deferred<void>();

        const skipCheckBalance: boolean = this.configService.get<boolean>('$games.run.skipCheckBalance');
        if (skipCheckBalance) {
            deferred.resolve();
            return deferred.promise;
        }

        await this.configService.ready;
        await this.injectionService.getService<BonusesService>('user.user-service');

        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );

        if (userInfo.balance > 0) {
            deferred.resolve();
            return deferred.promise;
        }
        const merchantFreeRound = _find(userInfo.freeRounds, (freeRound: IFreeRound): boolean => {
            return this.merchantId === +freeRound.IDMerchant
                && +freeRound.Count
                && freeRound.Games.includes(this.game.launchCode);
        });

        if (merchantFreeRound || _includes(this.merchantsWithOwnWallet, this.merchantId)) {
            deferred.resolve();
            return deferred.promise;
        }

        deferred.reject(RejectReason.LowBalance);
        const redirect: IRedirect = this.configService.get<IRedirect>('$base.redirects.zeroBalance');

        //WlcStateService.setRedirect('app.games.play', $stateParams);

        if (GlobalHelper.isMobileApp()) {
            this.showErrorNotification(
                gettext('You will be redirected to main site for deposit more money.'),
                gettext('Insufficient balance!'),
            );

            const jwtAuthToken: string = this.configService.get({
                name: 'jwtAuthToken',
                storageType: 'localStorage',
            });

            if (jwtAuthToken) {

                const lang: string = this.configService.get('currentLanguage');

                setTimeout(() => {
                    GlobalHelper.openBrowserLinkFromMobileApp(
                        `${GlobalHelper.mobileAppConfig.apiUrl}/${lang}/profile/cash?token=${jwtAuthToken}`,
                    );
                }, 4000);
            }
        } else if (redirect.modalInsteadRedirect) {
            this.modalService.showModal(redirect.modalInsteadRedirect, {game: this.game});
        } else {
            this.showErrorNotification(
                gettext('Deposit more money to play this game.'),
                gettext('Insufficient balance!'),
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

    /**
     * Check user fields
     *
     * @returns {Promise}
     */
    private checkUserFields(): Promise<void> {
        const defered = new Deferred<void>();

        this.merchantFieldsService.checkRequiredFields(this.merchantId).then((): void => {
            defered.resolve();
        }, async (emptyFields: string[]): Promise<void> => {
            if (!await this.configService.get<Promise<boolean>>('$user.skipPasswordOnFirstUserSession')) {
                emptyFields.push('password');
            }

            emptyFields.push('submit');

            this.modalService.showModal({
                id: 'add-profile-info',
                modifier: 'add-profile-info',
                component: AddProfileInfoComponent,
                componentParams: <IAddProfileInfoCParams>{
                    formConfig: {
                        class: 'wlc-form-wrapper',
                        components: _uniqWith(emptyFields.map((field: string): IFormComponent => {
                            const formElement = _cloneDeep(FormElements
                                [UserHelper.emptyFieldsAlias[field] || field]);

                            if (this.enableRequirement && field !== 'submit') {
                                UserHelper.setValidatorsFormElementsForCuracaoWlc(
                                    (UserHelper.emptyFieldsAlias[field] || field), formElement,
                                );
                            }

                            return formElement;
                        }), _isEqual),
                    },
                    redirect: {
                        success: {
                            to: this.transition.$to(),
                            params: this.transition.params(),
                        },
                    },
                },
                showFooter: false,
                dismissAll: true,
                backdrop: 'static',
            });

            defered.reject(RejectReason.EmptyRequiredFields);
        });
        return defered.promise;
    }

    private showErrorNotification(message: string, title: string = gettext('Game launch error')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: 'notification_game-launch-error',
            },
        });
    }

    private closeGameHandler(): Subscription {
        const filterCache: null | IGamesFilterData =
            _isEmpty(this.gamesFilterService.filterCache['modal']) ? null
                : {...this.gamesFilterService.filterCache['modal']};

        const closeGameSubscription$: Subscription = this.eventService.subscribe(
            {name: 'CLOSE_GAME'},
            () => {
                if (!this.previousState.name) {
                    this.router.stateService.go('app.home');
                    return;
                }

                if (this.previousState.name !== 'app.gameplay') {
                    this.router.stateService.go(this.previousState, this.transition.params('from'));
                } else {
                    const lastStateNotGamePlay = this.stateHistoryService.lastNotGamePlayState;
                    this.router.stateService.go(lastStateNotGamePlay.state, lastStateNotGamePlay.params);
                    this.stateHistoryService.lastNotGamePlayState = null;
                }

                if (filterCache) {
                    this.filterCacheCleared$.promise.then(() => {
                        this.gamesFilterService.filterCache['modal'] = filterCache;
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

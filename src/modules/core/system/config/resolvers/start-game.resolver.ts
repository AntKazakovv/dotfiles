'use strict';

import {
    StateService,
    UIRouter,
    Transition,
    RawParams,
    ResolveTypes,
} from '@uirouter/core';
import {
    first,
} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    LogService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    IRedirect,
    Deferred,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    Bonus,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {
    Game,
    IDisablePlayRealByCountry,
    IPlayGameForRealCParams,
    MerchantFieldsService,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    UserService,
    UserInfo,
} from 'wlc-engine/modules/user';

import _clone from 'lodash-es/clone';
import _reduce from 'lodash-es/reduce';
import _includes from 'lodash-es/includes';
import _union from 'lodash-es/union';
import _toNumber from 'lodash-es/toNumber';

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

    private gamesCatalogService: GamesCatalogService;
    private merchantFieldsService: MerchantFieldsService;

    constructor(
        private configService: ConfigService,
        private logService: LogService,
        private stateService: StateService,
        private router: UIRouter,
        private modalService: ModalService,
        private transition: Transition,
        private eventService: EventService,
        private injectionService: InjectionService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        const waiter = this.logService.waiter({code: '3.0.11'}, 7000);

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

        if (!this.checksForPlayReal() || !await this.checkGame()) {
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

        const stateChangeHandler = this.router.transitionService.onStart({}, (transition) => {
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

        const userService = await this.injectionService.getService<UserService>('user.user-service');

        await userService.userInfo$.pipe(first((v: UserInfo) => v?.dataReady)).toPromise();

        if (userService.userInfo?.balance > 0) {
            deferred.resolve();
            return deferred.promise;
        }

        //WlcStateService.setRedirect('app.games.play', $stateParams);
        this.showErrorNotification(
            gettext('Deposit more money to play this game.'),
            gettext('Insufficient balance!'),
        );

        deferred.reject(RejectReason.LowBalance);
        const redirect: IRedirect = this.configService.get<IRedirect>('$base.redirects.zeroBalance');
        if (this.configService.get('$finances.fastDeposit.use')) {
            //@TODO After ready fast deposit
            //this.modalService.showModal('fastDeposit');
        } else {
            this.stateService.go(redirect.state, redirect?.params || this.transition.params());
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

        this.merchantFieldsService.checkRequiredFields(this.merchantId).then(() => {
            defered.resolve();
        }, (emptyFields: string[]) => {

            // @TODO Replace to modal with required fields
            this.modalService.showModal({
                id: 'game-required-fields',
                modalTitle: gettext('Fill required fields'),
                modalMessage: gettext('For play, fill data in your profile'),
                modifier: 'game-required-fields',
                onModalHide: () => {
                    this.stateService.go('app.profile.main.info', this.transition.params());
                },
                size: 'md',
                backdrop: 'static',
            });

            // const modalParams = wlcModalRegistryProvider.get('requiredFields');
            // modalParams.requiredFields = emptyFields;
            // modalParams.showPassword = this.configService.get('appConfig.siteconfig.profile.checkPassOnUpdate');
            // modalParams.onSuccess = () => {
            //     this.stateService.go('app.games.play', this.stateService.params);
            // };
            // this.modalService.showDialog(modalParams);
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
}

'use strict';

import {StateService, UIRouter, Transition, RawParams, ResolveTypes} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {ConfigService, EventService} from 'wlc-engine/modules/core/system/services';
import {LogService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';
import {MerchantFieldsService} from 'wlc-engine/modules/games/system/services';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';
import {IDisablePlayRealByCountry} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IPlayGameForRealCParams} from 'wlc-engine/modules/games/components/play-game-for-real/play-game-for-real.params';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';

import {skipWhile} from 'rxjs/operators';

import {
    includes as _includes,
    clone as _clone,
    union as _union,
    reduce as _reduce,
    toNumber as _toNumber,
} from 'lodash-es';

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
        TranslateService,
        GamesCatalogService,
        UIRouter,
        Transition,
        ModalService,
        UserService,
        BonusesService,
        MerchantFieldsService,
        EventService,
    ],
    resolveFn: (
        configService: ConfigService,
        logService: LogService,
        stateService: StateService,
        translateService: TranslateService,
        gamesCatalogService: GamesCatalogService,
        router: UIRouter,
        transition: Transition,
        modalService: ModalService,
        userService: UserService,
        bonusesService: BonusesService,
        merchantFieldsService: MerchantFieldsService,
        eventService: EventService,
    ) => {
        return new StartGameHandler(
            configService,
            logService,
            stateService,
            router,
            translateService,
            gamesCatalogService,
            modalService,
            transition,
            userService,
            bonusesService,
            merchantFieldsService,
            eventService,
        ).result.promise;
    },
};

class StartGameHandler {
    public result = new Deferred();

    private mobile: boolean = false;
    private isDemo: boolean = false;
    private authenticated: boolean = false;
    private realPlayDisabled: boolean = false;
    private realPlayDisabledByCountry: boolean = false;
    private checkProfileRequiredFields: boolean = false;
    private merchantId: number;
    private zeroBalanceRedirect: IRedirect;
    private game: Game;

    constructor(
        private configService: ConfigService,
        private logService: LogService,
        private stateService: StateService,
        private router: UIRouter,
        private translateService: TranslateService,
        private gamesCatalogService: GamesCatalogService,
        private modalService: ModalService,
        private transition: Transition,
        private userService: UserService,
        private bonusesService: BonusesService,
        private merchantFieldsService: MerchantFieldsService,
        private eventService: EventService,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        const waiter = this.logService.waiter({code: '3.0.11'}, 7000);
        try {
            await this.gamesCatalogService.ready;
        } catch (err) {
            this.logService.sendLog({code: '3.0.0', data: err});
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
                    locale: this.configService.get('appConfig.language'),
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

        this.authenticated = this.userService.isAuthenticated;
        this.mobile = this.configService.get<boolean>('appConfig.siteconfig.mobile');
        this.isDemo = this.transition.params().demo === 'true';
        this.realPlayDisabled = this.configService.get<boolean>('$games.realPlay.disable');
        this.checkProfileRequiredFields = this.configService.get<boolean>('$games.run.checkProfileRequiredFields');
        this.merchantId = _toNumber(this.transition.params().merchantId);
        this.zeroBalanceRedirect = this.configService.get<IRedirect>('$core.redirects.zeroBalance');

        this.setRealPlayDisabledByCountry();
    }

    private setRealPlayDisabledByCountry(): void {
        const realPlayDisableByCountry: IDisablePlayRealByCountry = this.configService.get('$games.realPlay.disableByCountry');
        const counryListDefault: string[] = realPlayDisableByCountry.default || [];

        let counryListMerchant: string[] = [];
        if (realPlayDisableByCountry.forMerchant?.[this.merchantId]) {
            counryListMerchant = _reduce(realPlayDisableByCountry.forMerchant, (res, countryList: string[], merchantId) => {
                return this.gamesCatalogService.getMerchantById(_toNumber(merchantId)) ? _union(res, countryList) : res;
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
        if(!this.isDemo && (this.realPlayDisabled || this.realPlayDisabledByCountry)) {
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
                this.stateService.go(this.stateService.current.name, this.transition.params(), {reload: true});
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

        const activeBonuses: Bonus[] = await this.bonusesService.queryBonuses(true, 'active');

        if (activeBonuses && this.gameRestrictedByActiveBonuses(this.game, activeBonuses)) {
            this.showErrorNotification(gettext('Sorry, this game is disabled with an active bonus'));

            this.result.reject(RejectReason.RestrictedByActiveBonuses);
            this.stateService.go('app.home', this.transition.params(), {reload: true});
            return;
        }

        const redirect: IRedirect = this.configService.get<IRedirect>('$core.redirects.zeroBalance');
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
            this.modalService.showModal<IPlayGameForRealCParams>('runGame', {
                common: {
                    game: this.game,
                    disableDemo: false,
                },
            });
            this.result.reject(RejectReason.AuthRequired);
        } else {
            this.result.resolve();
        }


        // if (this.mobile) {
        //     this.result.resolve();
        //     return;
        // }

        // let authOk = false;
        // const authHandler = this.messagingService.subscribe(this.userService.events.AUTH_SUCCEEDED, () => {
        //     authOk = true;
        //     this.wlcStateService.setRedirect('app.games.play', this.stateService.params);
        // });
        //
        // this.modalService.showDialog({
        //     game: this.game,
        //     dismissAll: true,
        //     size: 'sm',
        //     windowClass: 'wlc-modal-game-login',
        //     templateUrl: '/static/js/templates/dialogs/play-for-free.html',
        // }).result.then((result) => {
        //     result = result || 'close';
        //
        //     this.wlcStateService.clearRedirect();
        //     switch (result) {
        //         case 'close':
        //             if (!this.wlcStateService.get(0)) {
        //                 this.stateService.go('app.home');
        //             }
        //             break;
        //     }
        // }, () => {
        //     if (this.wlcStateService.getRedirect()) {
        //         this.wlcStateService.redirect()
        //     } else if (!this.wlcStateService.get(0)) {
        //         this.stateService.go('app.home');
        //     }
        // }).catch(() => {
        //     this.messagingService.unsubscribe(authHandler);
        //     if (!authOk) {
        //         this.wlcStateService.clearRedirect();
        //     }
        // });
        // this.result.reject({
        //     type: 'AUTH_REQUIRED',
        // });
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

        const userInfo = new Deferred<void>();
        const subscription = this.userService.userInfo$.pipe(skipWhile(v => !v))
            .subscribe(() => {
                userInfo.resolve();
                subscription.unsubscribe();
            });
        await userInfo.promise;

        if (this.userService.userInfo?.balance > 0) {
            deferred.resolve();
            return deferred.promise;
        }

        //WlcStateService.setRedirect('app.games.play', $stateParams);
        this.showErrorNotification(
            gettext('Deposit more money to play this game.'),
            gettext('Insufficient balance!'),
        );

        deferred.reject(RejectReason.LowBalance);
        const redirect: IRedirect = this.configService.get<IRedirect>('$core.redirects.zeroBalance');
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
        if (this.isDemo) {
            return false;
        } else if (!this.configService.get<boolean>('$games.run.checkActiveBonusRestriction')) {
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

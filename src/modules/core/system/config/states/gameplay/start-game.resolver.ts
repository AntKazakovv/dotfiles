'use strict';

import {StateService, UIRouter, Transition, RawParams} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';
import {ResolveTypes} from '@uirouter/core/lib/state/interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {LogService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {Deferred} from 'wlc-engine/modules/core/system/classes';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {IModalConfig} from 'wlc-engine/modules/core/components/modal';

import {
    includes as _includes,
    keys as _keys,
    intersection as _intersection,
    forEach as _forEach,
    clone as _clone,
} from 'lodash';

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
        ).result.promise;
    },
};

class StartGameHandler {
    public result = new Deferred();

    private mobile: boolean = false;
    private isDemo: boolean = false;
    private authenticated: boolean = false;
    private playForReal: boolean = false;
    private realPlayDisableByCountry: boolean = false;
    private checkRequiredFields: boolean = false;
    private merchantId: string;
    private zeroBalanceRedirect: any;
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
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        this.prepare();
        if (!this.checkPlayReal() || !await this.checkGame()) {
            return;
        }

        if (this.authenticated) {
            //this.checksForAuthenticated();
        } else {
            //this.checksForUnauthorized();
        }

        // @TODO Delete in feature
        this.result.resolve();
    }

    /**
     * Prepare actions
     */
    private prepare(): void {
        const checkOnRunWaiter = this.logService.durationWaiter({
            code: '3.0.27',
            data: {
                merchantId: this.stateService.params?.merchantId,
                launchCode: this.stateService.params?.launchCode,
            },
        });
        this.logService.sendLog({
            code: '3.0.29',
            data: {
                merchantId: this.stateService.params?.merchantId,
                launchCode: this.stateService.params?.launchCode,
            },
        });

        this.result.promise.catch(() => {
            this.logService.sendLog({
                code: '3.0.26',
                data: {
                    merchantId: this.stateService.params?.merchantId,
                    launchCode: this.stateService.params?.launchCode,
                },
            });
        });

        const stateChangeHandler = this.router.transitionService.onStart({}, (transition) => {
            this.result.reject({
                type: 'STATE_CHANGE_START',
            });

            this.logService.sendLog({
                code: '3.0.28',
                data: {
                    merchantId: this.stateService.params?.merchantId,
                    launchCode: this.stateService.params?.launchCode,
                },
            });
            stateChangeHandler();
        });

        this.result.promise.finally(() => {
            checkOnRunWaiter.resolve();
            stateChangeHandler();
        });

        this.mobile = this.configService.get<boolean>('appConfig.siteconfig.mobile');
        this.isDemo = !!this.transition.params().demo;
        this.authenticated = this.userService.isAuthenticated;
        this.playForReal = this.configService.get<boolean>('appConfig.siteconfig.game.playForReal');

        this.realPlayDisableByCountry = _includes(
            this.configService.get('$games.realPlayDisableByCountry') || [],
            this.configService.get<string>('appConfig.country')
        );

        this.checkRequiredFields = this.configService.get<boolean>('appConfig.siteconfig.checkRequiredFields');
        this.merchantId = this.stateService.params?.merchantId;
        this.zeroBalanceRedirect = this.configService.get<boolean>('appConfig.siteconfig.redirects.zeroBalanceRedirect');
    }

    /**
     * Check play real
     *
     * @returns {boolean}
     */
    private checkPlayReal(): boolean {
        if(!this.isDemo && (this.playForReal || this.realPlayDisableByCountry)) {
            const modalParams: Partial<IModalConfig> = {};
            if (this.realPlayDisableByCountry) {
                modalParams.modalMessage = gettext('Play for real is disabled in your country');
            }
            if (this.playForReal) {
                modalParams.modalMessage = gettext('Sorry, gambling is not possible');
            }
            this.modalService.showError(modalParams);
            this.result.reject('PLAY_FOR_REAL_DISABLED');
            return false;
        }
        return true;
    }

    /**
     * Check game
     * @returns {boolean}
     */
    private async checkGame(): Promise<boolean> {
        const waiter = this.logService.waiter({code: '3.0.11'}, 7000);
        try {
            await this.gamesCatalogService.ready;
        } catch (err) {
            this.logService.sendLog({code: '3.0.0', data: err});
        } finally {
            waiter();
        }

        this.game = this.gamesCatalogService.getGame(this.transition.params().merchantId, this.transition.params().launchCode);
        if (!this.game) {
            this.logService.sendLog({code: '3.0.1', data: this.stateService.params});
            this.result.reject({
                type: 'GAME_NOT_FOUND',
            });
            return false;
        } else if (this.isDemo) {
            if (this.game.hasDemo) {
                this.result.resolve();
                return;
            }

            this.modalService.showError({
                modalTitle: gettext('Game has no demo!'),
                modalMessage: gettext('Dear Client, this game has no demo mode, you will redirect to normal mode.'),
                onModalHidden: () => {
                    const stateParams: RawParams = _clone(this.transition.params());
                    stateParams.demo = false;
                    this.stateService.go('app.gameplay', stateParams);
                },
            });

            this.result.reject({
                type: 'GAME_HAS_NO_DEMO',
            });
            return false;
        }
        return true;
    }

    /**
     * Checks for authenticated users
     */
    private checksForAuthenticated(): void {
        this.getActiveBonuses().then(async (activeBonuses) => {
            if (this.checkActiveBonusRestriction(this.game, activeBonuses)) {
                // @TODO After creating ModalService
                //this.errorService.showModal(this.translateService.instant(
                // gettext('Sorry, this game is disabled with an active bonus')), 'Error');
                this.result.reject();
            }

            const redirect = this.configService.get<boolean>('appConfig.siteconfig.redirects.zeroBalanceRedirect');
            if (!redirect) {
                if (!this.checkRequiredFields) {
                    this.result.resolve();
                } else {
                    this.checkUserFields().then(() => {
                        this.result.resolve();
                    }, (r) => {
                        this.result.reject(r);
                    });
                }
            } else if (redirect && !this.checkRequiredFields) {
                try {
                    await this.checkUserBalance();
                    this.result.resolve();
                } catch (err) {
                    this.result.reject(err);
                }
            } else {
                try {
                    await this.checkUserFields();
                    await this.checkUserBalance();
                    this.result.resolve();
                } catch (err) {
                    this.result.reject(err);
                }
            }

        }).catch(() => {
            this.result.resolve();
        });
    }

    /**
     * Checks for unauthorized users
     */
    private checksForUnauthorized() {
        if (this.mobile) {
            this.result.resolve();
            return;
        }

        // @TODO After creating MessagingService, WlcStateService, UserService
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

        this.result.reject({
            type: 'AUTH_REQUIRED',
        });
    }

    /**
     * Check user balanse
     *
     * @returns {Promise}
     */
    private checkUserBalance(): Promise<any> {
        const deferred = new Deferred();

        const skipCheckBalance = this.configService.get<boolean>('appConfig.siteconfig.games.skipCheckBalanceBeforeGame');
        if (skipCheckBalance) {
            deferred.resolve();
            return deferred.promise;
        }

        // @TODO After creating of UserService
        // this.userService.fetchUserInfo().then(info) => {
        //     if (parseFloat(info.balance) > 0) {
        //         return deferred.resolve();
        //     }
        //
        //     //WlcStateService.setRedirect('app.games.play', $stateParams);
        //
        //     //const options = wlcModalRegistryProvider.get('lowBalance');
        //     //ModalService.showDialog(options);
        //
        //     deferred.reject({
        //         type: 'GAME_LOW_BALANCE',
        //     });
        // }, () => {
        //     deferred.reject({
        //         type: 'GAME_LOW_BALANCE',
        //     });
        // });
        return deferred.promise;
    }

    /**
     * Get active bonuses (for authenticated users)
     *
     * @returns {Promise}
     */
    private getActiveBonuses(): Promise<any> {
        const defered = new Deferred();

        // @TODO After creating of LoyaltyBonusesService
        // this.loyaltyBonusesService.getBonuses({type: 'active'}).then(() => {
        //     return defered.resolve(this.loyaltyBonusesService.activeBonuses);
        // }).catch((error) => {
        //     return defered.reject(error);
        // });
        return defered.promise;
    }

    /**
     * Check active bonus restriction
     *
     * @param game
     * @param activeBonuses
     * @returns {boolean}
     */
    private checkActiveBonusRestriction(game: Game, activeBonuses): boolean {
        if (this.isDemo) {
            return false;
        } else if (!this.configService.get<boolean>('appConfig.siteconfig.games.checkActiveBonusRestriction')) {
            return false;
        }

        let gameRestricted = false;
        _forEach(activeBonuses, (bonus) => {
            const gamesWhiteList = bonus.GamesRestrictType === '1' ? bonus.IDGames : [],
                gamesBlackList = bonus.GamesRestrictType === '0' ? bonus.IDGames : [],
                categoriesWhiteList = bonus.CategoriesRestrictType === '1' ? _keys(bonus.IDCategories) : [],
                categoriesBlackList = bonus.CategoriesRestrictType === '0' ? _keys(bonus.IDCategories) : [];

            if (
                gamesBlackList[game.ID] ||
                _keys(gamesWhiteList).length && !gamesWhiteList[game.ID] && !_keys(gamesBlackList).length ||
                _intersection(categoriesBlackList, game.categoryID).length ||
                categoriesWhiteList.length && !_intersection(categoriesWhiteList, game.categoryID).length
                && !categoriesBlackList.length
            ) {
                gameRestricted = true;
            }
        });
        return gameRestricted;
    }

    /**
     * Check user fields
     *
     * @returns {Promise}
     */
    private checkUserFields(): Promise<any> {
        const defered = new Deferred();

        // @TODO After Modals and MerchantFields will be created
        // MerchantFields.checkRequiredFields(this.merchantId).then(() => {
        //     defered.resolve();
        // }, (requiredFields) => {
        //     const modalParams = wlcModalRegistryProvider.get('requiredFields');
        //     modalParams.requiredFields = requiredFields;
        //     modalParams.showPassword = !!this.configService.appConfig.siteconfig.checkPassOnUpdate;
        //     modalParams.onSuccess = () => {
        //         this.stateService.go('app.games.play', this.stateService.params);
        //     };
        //     this.modalService.showDialog(modalParams);
        //     defered.reject({
        //         type: 'GAME_REQUIRED_FIELDS',
        //     });
        // });
        return defered.promise;
    }
}

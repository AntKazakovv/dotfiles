import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    from,
    interval,
    Observable,
    Subject,
    throwError,
} from 'rxjs';
import {
    takeUntil,
    filter,
    mergeMap,
    catchError,
    map,
    first,
} from 'rxjs/operators';

import _isArray from 'lodash-es/isArray';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    IPushMessageParams,
    LogService,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {IMerchantWalletFormCParams} from
    'wlc-engine/modules/games/components/merchant-wallet/merchant-wallet-form/merchant-wallet-form.params';
import {IMerchantWalletSystemConfig} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

/**
 * @param balanceSuccess - balance get request is succeeded
 * @param balanceFail - balance get request is failed
 * @param transferSuccess - balance post request is succeeded
 * @param transferFail - balance post request is failed
 */
export enum BalanceServiceEvents {
    balanceSuccess = 'UPDATE_BALANCE_SUCCESS',
    balanceFail = 'UPDATE_BALANCE_FAIL',
    transferSuccess = 'TRANSFER_SUCCESS',
    transferFail = 'TRANSFER_FAIL',
};

/**
 * @param systemId - merchant's ID
 */
export interface IBalanceParamsGet {
    systemId: number;
};

/**
 * @param systemId - merchant's ID
 * @param amount - amount to be transferred.
 * If value is positive, the request will process deposit,
 * if value is negative, the request will process withdraw
 */
export interface IBalanceParamsTransfer {
    systemId: number;
    amount: number;
};

/**
 * External wallet balance
 * @param available - user balance on external wallet
 * @param currency - user currency
 * @param loyaltyblock - the amount is blocked to withdraw by bonus
 */
export interface IMerchantWalletBalance {
    available: number;
    currency: string;
    loyaltyblock: number;
};

export type TBalanceTransferMethod = 'deposit' | 'withdraw';

export interface IGetBalanceResponse extends IData {
    data?: IMerchantWalletBalance;
};

export interface IPostBalanceResponse extends IData {
    data?: {
        result: boolean;
    };
};

const defMerchantConfig: IMerchantWalletSystemConfig = {
    minDeposit: 0.01,
    minWithdraw: 0.01,
};

@Injectable({providedIn: 'root'})
export class MerchantWalletService {

    private _merchant: MerchantModel;
    private _game: Game;
    private _currency: string;
    private merchantParams: IMerchantWalletSystemConfig;
    private balance$: BehaviorSubject<IMerchantWalletBalance> = new BehaviorSubject(null);

    private pauseIntervalRequest: boolean;
    private watcher$: Subject<null>;
    private helperRequest$: Observable<IMerchantWalletBalance>;

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private gameCatalogService: GamesCatalogService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
    ) {}

    /**
     * Active external wallet merchant
     */
    public get merchant(): MerchantModel {
        return this._merchant;
    }

    /**
     * Active external wallet merchant config
     */
    public get merchantConfig(): IMerchantWalletSystemConfig {
        return this.merchantParams;
    }

    /**
     * Active game
     */
    public get game(): Game {
        return this._game;
    }

    /**
     * Current merchant wallet balance
     */
    public get balance(): IMerchantWalletBalance {
        return this.balance$.getValue();
    }

    /**
     * User currency from user profile
     */
    public get userCurrency(): string {
        return this._currency;
    }

    /**
     * Merchant balance observer
     */
    public get balanceObserver(): Observable<IMerchantWalletBalance> {
        if (this.merchant) {
            this.initBalanceObserver();
            return this.balance$.asObservable();
        }
    }

    /**
     * Be called by the game-wrapper if the game merchant uses external wallet.
     * @param game current Game model
     */
    public async startMerchantWalletGame(game: Game): Promise<void> {
        this._merchant = this.gameCatalogService.getMerchantById(game.merchantID);
        this.merchantParams = {
            ...defMerchantConfig,
            ...this.configService
                .get<IMerchantWalletSystemConfig>(
                    `$games.merchantWallet.systemOptions[${this.merchant.id}]`,
                ),
        };

        this._game = game;
        this.watcher$ = new Subject();

        if (!this._currency) {
            this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
                .pipe(first((v: UserProfile): boolean => !!v && !!v.email))
                .subscribe((profile: UserProfile): void => {
                    this._currency = profile.currency;
                });
        }

        this.getBalance()
            .then((balance: IMerchantWalletBalance): void => {
                if (!balance.available) {
                    this.openFirstMeetModal();
                }
            })
            .catch((error: any): void => {
                this.logService.sendLog({
                    code: '21.0.0',
                    data: error,
                    from: {
                        service: 'MerchantWalletService',
                        method: 'startMerchantWalletGame',
                    },
                });
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: this.merchant.name,
                        message: _isArray(error.errors)
                            ? error.errors
                            : gettext('Error getting merchant wallet balance.'),
                    },
                });
            });
    }

    /**
     * Be called on destroy game-wrapper. Resets all data and observables.
     */
    public endMerchantWalletGame(): void {
        if (this.merchant) {
            this.balance$.next(null);
            this.watcher$.next();
            this.watcher$.complete();
            this.watcher$ = null;
            this._merchant = null;
            this._game = null;
            this._currency = null;
            this.pauseIntervalRequest = false;
        }
    }

    /**
     * Requests balance of current external wallet merchant.
     * @returns `Promise<IGetBalanceResponse>`
     */
    public async getMWBalance(): Promise<IMerchantWalletBalance> {
        if (this.merchant) {
            return await this.getBalance();
        } else {
            return Promise.reject('Merchant is not set');
        }
    }

    /**
     * Transfer amount to merchant external wallet
     * @param method available values `deposit` and `withdraw`
     * @param amount is should be transferred
     * @returns response result
     */
    public async transferFunds(method: TBalanceTransferMethod, amount: number): Promise<IPostBalanceResponse> {
        if (!this.merchant) {
            return Promise.reject('Merchant is not set');
        }

        const params: IBalanceParamsTransfer = {
            systemId: this.merchant.id,
            amount: method === 'deposit' ? amount : -1 * amount,
        };

        try {
            this.pauseIntervalRequest = true;
            const response: IPostBalanceResponse = await this.post(params);
            if (response.data?.result) {
                this.getBalance();
                this.modalService.closeAllModals();
            } else {
                throw response;
            }
        } catch(error) {
            return Promise.reject(error);
        } finally {
            this.pauseIntervalRequest = false;
        }
    }

    /**
     * Opens modal window with transfer form
     * @param method operation method
     */
    public openTransferModal(method: TBalanceTransferMethod): void {
        if (method === 'withdraw' && !this.balance$.getValue()?.available) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.merchant.name,
                    message: [
                        gettext('Withdrawal is unavailable due to zero balance on merchant wallet.'),
                    ],
                },
            });
            return;
        }

        this.modalService.showModal({
            id: 'ew-balance-transfer',
            modifier: 'info',
            wlcElement: 'ew-balance-transfer',
            showFooter: false,
            backdrop: 'static',
            modalTitle: method === 'deposit' ? gettext('Adding funds') : gettext('Funds withdrawal'),
            componentName: 'games.wlc-merchant-wallet-form',
            componentParams: <IMerchantWalletFormCParams>{
                method: method,
            },
        });
    }

    /**
     * Opens first meet modal, be called if merchant balance is 0
     */
    private openFirstMeetModal(): void {
        this.modalService.showModal({
            id: 'ew-zero-balance',
            modifier: 'info',
            wlcElement: 'ew-zero-balance',
            showConfirmBtn: true,
            confirmBtnText: gettext('Add'),
            rejectBtnVisibility: false,
            modalTitle: this.merchant.alias,
            componentName: 'games.wlc-merchant-wallet-info',
            onConfirm: () => {
                this.openTransferModal('deposit');
            },
        });
    }

    /**
     * Get balance. Request is wrapped with rxjs to turn it into the observable to prevent double request.
     * @returns IMerchantWalletBalance promise
     */
    private async getBalance(): Promise<IMerchantWalletBalance> {
        if (!this.helperRequest$) {
            this.helperRequest$ = from(this.dataService.request<IMerchantWalletBalance>({
                name: 'getBalance',
                system: 'finances',
                url: '/balance',
                type: 'GET',
                events: {
                    success: BalanceServiceEvents.balanceSuccess,
                    fail: BalanceServiceEvents.balanceFail,
                }}, {systemId: this.merchant.id}),
            ).pipe(
                catchError((error: any): Observable<never> => {
                    const errData = _isArray(error.errors) ? error
                        : {errors: [gettext('Error getting merchant wallet balance.')]};
                    this.balance$.next(errData);
                    return throwError(errData);
                }),
                map((response: IGetBalanceResponse) => {
                    this.balance$.next(response.data);
                    return response.data;
                }),
            );
        }

        return this.helperRequest$.toPromise().finally(() => {
            this.helperRequest$ = null;
        });
    }

    /**
     * Post request for adding/withdrawal funds
     * @param params `IBalanceParamsTransfer`
     * @returns `IPostBalanceResponse` promise
     */
    private async post(params: IBalanceParamsTransfer): Promise<IPostBalanceResponse> {
        return this.dataService.request({
            name: 'balance',
            system: 'finances',
            url: '/balance',
            type: 'POST',
            events: {
                success: BalanceServiceEvents.transferSuccess,
                fail: BalanceServiceEvents.transferFail,
            },
        }, params);
    }

    /**
     * Creates interval observer to get current balance during the game.
     */
    private initBalanceObserver(): void {
        interval(this.configService.get<number>('$games.merchantWallet.balanceRequestTimeout'))
            .pipe(
                takeUntil(this.watcher$),
                filter((): boolean => this.balance$.observers.length > 0 && !this.pauseIntervalRequest),
                mergeMap((): Promise<IMerchantWalletBalance> => this.getBalance()),
            ).subscribe();
    }
}

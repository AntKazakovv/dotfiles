import {
    Inject,
    Injectable,
    Injector,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    firstValueFrom,
    Observable,
    Subscription,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    first,
    map,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _merge from 'lodash-es/merge';

import {
    ConfigService,
    IIndexing,
    InjectionService,
    IData,
    DataService,
    EventService,
    ModalService,
    IPushMessageParams,
    NotificationEvents,
    LogService,
} from 'wlc-engine/modules/core';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user';
import {
    IDepWagerData,
    IFinancesConfig,
    ITaxData,
    TAdditionalParams,
    TPaySystemCategoriesConfig,
    TPaySystemTag,
} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {PIQCashierService} from 'wlc-engine/modules/finances/system/services/piq-cashier/piq-cashier.service';
import {
    PaymentSystem,
    IPaymentSystem,
    FilterType,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {TaxModel} from 'wlc-engine/modules/finances/system/models/tax.model';
import {
    PIQCashierResponse,
    TPaymentsMethods,
} from 'wlc-engine/modules/finances/system/interfaces/piq-cashier.interface';
import {cryptoInvoiceSystem} from 'wlc-engine/modules/finances/system/constants/crypto-invoices.constants';
import {FinancesHelper} from 'wlc-engine/modules/finances/system/helpers/finances.helper';
import {
    ISelectedWallet,
    WalletsService,
} from 'wlc-engine/modules/multi-wallet';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';
import {ITransaction, Transaction} from 'wlc-engine/modules/history';

type TUserDepositCountsInfo = Pick<UserInfo, 'depositsCount'>;

type TPaymentStatus = 'PAYMENT_SUCCESS' | 'PAYMENT_PENDING';
export type TPaymentStatusAll = TPaymentStatus | 'PAYMENT_FAIL';

export interface IPaymentPostMessage {
    message: TPaymentStatusAll;
    amount?: string;
    tid?: string;
    type?: string;
    currency?: string;
}

interface IQueries {
    amount: number;
    queries: number;
}

@Injectable({providedIn: 'root'})
export class FinancesService {

    public paymentSystems$: BehaviorSubject<PaymentSystem[]> = new BehaviorSubject(undefined);
    public taxes: TaxModel;

    protected fastDepLimit: number;
    protected fastDepCurrency: string;
    protected fastDepCheckStarted: boolean = false;
    protected needForFastDep: boolean = true;
    protected fastDepShowLimit: number;
    protected fastDepShowedCount: number;

    private systems: PaymentSystem[] = [];
    private emitDepositStatus$: Subscription;

    private _checkUserTags: boolean;
    private _isDepositBlocked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected injector: Injector,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected logService: LogService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.registerMethods();

        this.translateService.onLangChange.subscribe(() => {
            this.paymentSystems$.next(undefined);
            this.systems = [];
        });

        this._checkUserTags = this.configService.get<boolean>('$finances.checkUserTags.use');
        if (this.checkUserTags) {
            this.watchForUserTags();
        }
    }

    public get paymentSystems(): PaymentSystem[] {
        return this.systems;
    }

    public get checkUserTags(): boolean {
        return this._checkUserTags;
    }

    public isDepositBlocked$(): Observable<boolean> {
        return this._isDepositBlocked$.asObservable();
    }

    public getSystemById(id: number): PaymentSystem {
        return _find(this.systems, {id});
    }

    public getSystemByAlias(alias: string): PaymentSystem {
        return _find(this.systems, {alias});
    }

    public async deposit(
        systemId: number,
        amount: number,
        additionalFields: TAdditionalParams,
        cssVariables: string,
        wallet: ISelectedWallet = null,
    ): Promise<any> {

        if (wallet && !wallet.walletId) {
            const walletsService: WalletsService =
                await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
            const id: string = await walletsService.addWallet(wallet.walletCurrency);
            if (!id) return;
            wallet.walletId = Number(id);
        }

        return await this.balanceAction(
            systemId,
            amount,
            additionalFields,
            'deposit',
            'finances/deposits',
            cssVariables,
            wallet,
        );
    }

    public async withdraw(
        systemId: number,
        amount: number,
        additionalFields: IIndexing<string | number>,
        cssVariables: string,
        wallet: ISelectedWallet = null,
    ): Promise<any> {
        return await this.balanceAction(
            systemId,
            amount,
            additionalFields,
            'withdraw',
            'finances/postWithdrawal',
            cssVariables,
            wallet,
        );
    }

    public async getWithdrawQueries(): Promise<IQueries> {
        try {
            const result = await this.dataService.request<IData>('finances/getWithdrawal', {type: 'queries'});
            return result.data as IQueries;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async checkWithdraw(systemId: number): Promise<any> {
        try {
            const result = await this.dataService.request<IData>('finances/getWithdrawal', {
                type: 'status',
                systemId: systemId,
            });
            return result.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getPendingWithdraws(): Promise<Transaction[]> {
        try {
            const result = await this.dataService.request<IData>
            ('finances/getPendingWithdraws');

            return result.data as Transaction[];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async cancelWithdrawal(id: number): Promise<IData> {
        return await this.dataService.request<IData>({
            name: 'cancelWithdrawal',
            system: 'finances',
            url: '/withdrawals',
            type: 'DELETE',
            params: {id},
            events: {
                success: 'TRANSACTION_CANCEL',
            },
        });
    }

    public async getDepWager(): Promise<IDepWagerData[]> {
        try {
            const response: IData = await this.dataService.request<IData>('finances/getDepWager');
            const data: IDepWagerData[] = JSON.parse(response.data);
            return data;
        } catch (error) {
            this.logService.sendLog({
                code: '17.9.0',
                data: error,
            });
            return Promise.reject(error);
        }
    }

    /**
     * Confirm withdraw by user
     *
     * @param {id} - transaction id
     *
     * @returns {Promise<IData>}
     */
    public async confirmWithdrawal(id: number): Promise<string[]> {
        return (await this.dataService.request<IData>({
            name: 'confirmWithdrawal',
            system: 'finances',
            url: '/withdrawals/complete',
            type: 'PATCH',
            params: {id},
            events: {
                success: 'TRANSACTION_CONFIRM',
                fail: 'TRANSACTION_CONFIRM_FAIL',
            },
        })).data;
    }

    public async fetchPaymentSystems(currency?: string): Promise<PaymentSystem[]> {
        if (!currency) {
            const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');

            currency =
                userProfile$.getValue()?.originalCurrency
                ?? (await firstValueFrom(
                    userProfile$
                        .pipe(
                            first(userProfile => !!userProfile?.idUser),
                        )))
                    ?.originalCurrency
                ?? this.configService.get<string>('$base.defaultCurrency');
        }

        this.systems = this.createPaymentSystems((await this.dataService
            .request<IData>('finances/paymentSystems', {currency}))
            .data as IPaymentSystem[]);

        // TODO delete when will be completed #247624
        this.systems = this.systems.filter(system => !system.alias.includes('helper'));

        this.paymentSystems$.next(this.systems);
        return this.systems;
    }

    /**
     * Update payment system list for deposit via invoice.
     * Adds virtual payment system, which collects all invoice systems
     * @param systems payment system list to be updated
     * @returns modified payment list
     */
    public updateForCryptoInvoices(systems: PaymentSystem[]): PaymentSystem[] {
        const invoicesSystems: PaymentSystem[] = [];
        const otherSystems: PaymentSystem[] = [];
        let firstInvoiceIndex: number;

        _forEach(systems, (system: PaymentSystem, index: number): void => {
            if (system.cryptoInvoices) {
                firstInvoiceIndex ??= index;
                invoicesSystems.push(system);
            } else {
                otherSystems.push(system);
            }
        });

        const parentSystem: PaymentSystem = this.createPaymentSystem(
            _merge({}, cryptoInvoiceSystem, this.configService.get('$finances.cryptoInvoices.paySystemParams'),
                {tags: FinancesHelper.collectTags(invoicesSystems)}),
            invoicesSystems,
        );

        otherSystems.splice(firstInvoiceIndex, 0, parentSystem);

        return otherSystems;
    }

    /* public getPaymentSystemInfo(): Promise<IPaymentSystemInfo[]> {
        return null;
    } */

    /**
     * get systems list with filter by type
     *
     * @param filterType {FilterType} - type of payment system
     *
     * @return {PaymentSystem[]} list of filtred payment systems
     */
    public filterSystems(filterType: FilterType = 'all'): PaymentSystem[] {
        return this.systems.filter((system: PaymentSystem) => FinancesHelper.checkSystemType(system, filterType));
    }

    /**
     * check payment system to type
     *
     * @param system {PaymentSystem} - payment system object
     * @param filterType {FilterType} - type of payment system
     *
     * @return {boolean} result of check
     */

    public filterSystemsPipe(system: PaymentSystem, filterType: FilterType = 'all'): boolean {
        return FinancesHelper.checkSystemType(system, filterType);
    }

    public cancelInvoiceHandler(systemId: number): void {
        this.modalService.showModal({
            id: 'cancel-invoice-confirm',
            modalTitle: gettext('Confirmation'),
            modalMessage: gettext('Are you sure?'),
            modifier: 'confirmation',
            showConfirmBtn: true,
            closeBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('No'),
                },
            },
            confirmBtnText: gettext('Yes'),
            textAlign: 'center',
            onConfirm: () => {
                this.cancelInvoice(systemId);
            },
        });
    }

    /**
     * Requests last success payment method
     * @param isDeposit - mode of cash, if true, then the type of request is Deposit, else Withdrawal
     * @returns {number} `number` - method id or null
     */
    @CustomHook('finances', 'getLastSucceedPaymentMethod')
    public async getLastSucceedPaymentMethod(isDeposit: boolean): Promise<number | null> {
        try {
            const result: IData<string> = await this.dataService.request({
                name: isDeposit ? 'lastDepositSucceedMethod' : 'lastWithdrawalSucceedMethod',
                system: 'finances',
                url: isDeposit ? '/lastSuccessfulDeposit' : '/lastSuccessfulWithdrawal',
                type: 'GET',
            });
            return Number(result.data) > 0 ? Number(result.data) : null;
        } catch (error) {
            this.logService.sendLog({
                code: '17.3.0',
                data: error,
            });
            return null;
        }
    }

    public async getTaxes(locale: string = 'romanian'): Promise<TaxModel> {
        try {
            const result: IData<ITaxData> = await this.dataService.request(
                {
                    name: 'commissions',
                    system: 'finances',
                    url: `/commissions/${locale}`,
                    type: 'GET',
                },
            );
            this.taxes = new TaxModel(result.data);
            return this.taxes;
        } catch (error) {
            this.logService.sendLog({
                code: '17.5.0',
                data: error,
            });
        }
    }

    public async makePrestep(
        systemId: number,
        amount: number,
        additionalFields: object,
    ): Promise<any> {
        try {
            const result: IData<string> = await this.dataService.request(
                {
                    name: 'prestep',
                    system: 'finances',
                    url: '/deposits/prestep',
                    type: 'POST',
                },
                {
                    systemId,
                    amount,
                    additional: additionalFields,
                });
            return result.data;
        } catch (error) {
            this.logService.sendLog({
                code: '17.4.0',
                data: error,
            });
            throw error;
        }
    }

    @CustomHook('finances', 'financesServiceOnPaymentFail')
    public onPaymentFail(): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>(
            {name: '$user.userProfile$'},
        );
        userProfile$.pipe(first((profile) => !!profile)).subscribe(() => {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Payment failed'),
                    message: [
                        gettext('Unfortunately your payment didn\'t go through.'
                            + ' An e-mail with detailed information has been sent to your e-mail address.'
                            + ' If you have any questions, please don\'t hesitate to contact us.'),
                    ],
                    wlcElement: 'notification_deposit-error',
                },
            });
        });
    }

    @CustomHook('finances', 'financesServiceOnPaymentSuccess')
    public onPaymentSuccess(initialPath: IPaymentPostMessage): void {
        const userProfile$ = this.configService.get<BehaviorSubject<UserProfile>>(
            {name: '$user.userProfile$'},
        );

        userProfile$.pipe(first((profile) => !!profile)).subscribe((profile: UserProfile) => {

            this.configService.get<Deferred<null>>({name: 'firstLanguageReady'})
                .promise
                .then(() => {
                    const type = initialPath.type?.toLowerCase();
                    const message: string[] = [
                        (type === 'withdraw')
                            ? this.translateService.instant(gettext('Withdraw request has been successfully sent!'))
                            : this.translateService.instant(gettext('The deposit has been successfully made')),
                    ];
                    const isMultiWallet: boolean =
                        this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
                    const isShowAmount: boolean = !!initialPath.amount && (isMultiWallet ? this.configService
                        .get('$finances.alerts.showAmountInMultiWallet')
                        && !!initialPath.currency
                        : true);

                    if (isShowAmount) {
                        const currencyElement = `<span wlc-currency [value]="${initialPath.amount}" `
                            + `[currency]="'${isMultiWallet ? initialPath.currency : profile.currency}'"></span>`;

                        if (type === 'withdraw') {
                            message.push(
                                this.translateService.instant(gettext('Withdrawal amount')) + ` ${currencyElement}`,
                            );
                        } else {
                            message.push(
                                this.translateService.instant(
                                    gettext('{{currencyElement}} were successfully deposited into your account'),
                                    {currencyElement: currencyElement},
                                ),
                            );
                        }
                    }

                    const paymentMessage = {
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'success',
                            title: gettext('Payment success'),
                            displayAsHTML: true,
                            wlcElement: 'notification_deposit-success',
                            message,
                        },
                    };

                    if (type === 'withdraw') {
                        _assign(paymentMessage.data,
                            {
                                title: gettext('Withdraw'),
                                wlcElement: 'notification_withdraw-success',
                                message,
                            });
                    } else {
                        if (!this.emitDepositStatus$) {
                            this.emitDepositStatus$ = this.dataService.flow
                                .pipe(
                                    filter(
                                        (data: IData): boolean => {
                                            return data.system === 'user'
                                                && data.code === 200
                                                && data.name === 'userInfo'
                                                && data.data.loyalty.DepositsCount > 0;
                                        }),
                                    map((data: IData): TUserDepositCountsInfo =>
                                        ({depositsCount: Number(data.data.loyalty.DepositsCount)})),
                                    distinctUntilChanged(
                                        (prev: TUserDepositCountsInfo, curr: TUserDepositCountsInfo): boolean => {
                                            return prev.depositsCount === curr.depositsCount;
                                        }))
                                .subscribe((data: TUserDepositCountsInfo): void => {
                                    if (data.depositsCount === 1) {
                                        this.eventService.emit({
                                            name: 'FIRST_DEPOSIT_COMPLETE',
                                            data: {
                                                amount: initialPath.amount,
                                                currency: profile.currency,
                                            },
                                        });
                                    };

                                    this.eventService.emit({
                                        name: 'DEPOSIT_COMPLETE',
                                        data: {
                                            depositsCount: data.depositsCount,
                                            amount: initialPath.amount,
                                            currency: profile.currency,
                                        },
                                    });
                                });
                        }

                        this.eventService.emit({
                            name: 'DEPOSIT_SUCCESS',
                            data: {
                                amount: initialPath.amount,
                                currency: profile.currency,
                            },
                        });
                    };

                    this.eventService.emit(paymentMessage);
                });
        });
    }

    @CustomHook('finances', 'financesServiceOnPaymentPending')
    public onPaymentPending(): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'info',
                title: gettext('Payment pending'),
                message: [
                    gettext('Transaction is in the pending status.'
                        + ' If everything goes as expected, your funds soon will reach the gaming balance.'),
                ],
                wlcElement: 'notification_deposit-pending',
            },
        });
    }

    public async checkForAutoFastDep(): Promise<Subscription> {
        this.fastDepShowLimit = this.configService.get('$finances.fastDeposit.gamePlayShowLimit');
        this.fastDepShowedCount = 0;
        this.fastDepCheckStarted = false;
        this.needForFastDep = true;

        const profile: BehaviorSubject<UserProfile>
            = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        const currency: string = profile?.getValue().currency || 'EUR';
        const lastSucceedDepMethod: number = await this.getLastSucceedPaymentMethod(true);

        if (currency !== this.fastDepCurrency) {
            this.updateFastDepLimits(currency);
        }

        if (lastSucceedDepMethod) {
            return this.configService.get<BehaviorSubject<UserInfo>>('$user.userInfo$')
                .pipe(
                    map(({realBalance}) => {
                        if (realBalance > this.fastDepLimit) {
                            this.needForFastDep = true;
                        }
                        return realBalance;
                    }),
                    distinctUntilChanged(),
                )
                .subscribe((balance: number): void => {
                    if (!this.fastDepCheckStarted) {
                        this.fastDepCheckStarted = true;
                        return;
                    }

                    if (this.needForFastDep
                        && balance <= this.fastDepLimit
                        && this.fastDepShowedCount < this.fastDepShowLimit
                    ) {
                        this.eventService.emit({name: 'SHOW_FAST_DEPOSIT'});
                        this.fastDepShowedCount++;
                        this.needForFastDep = false;
                    }
                });
        }
    }

    protected updateFastDepLimits(currency: string): void {
        const limits: IIndexing<number>
            = this.configService.get<IIndexing<number>>('appConfig.siteconfig.MinimalBalanceNotifications');

        if (currency in limits) {
            this.fastDepCurrency = currency;
            this.fastDepLimit = limits[currency];
        }
        this.fastDepCurrency = currency;
        this.fastDepLimit = this.fastDepLimit ?? 0;
    }

    private async cancelInvoice(systemId: number): Promise<void> {
        try {
            await this.dataService.request('finances/cancelDeposit', {systemId});

            this.pushNotification({
                type: 'success',
                title: gettext('Deposit'),
                message: gettext('Invoice has been successfully canceled'),
                wlcElement: 'notification_deposit-cancel-invoice-success',
            });

            if (this.modalService.getActiveModal('payment-message')) {
                this.modalService.hideModal('payment-message');
            }

            await this.fetchPaymentSystems();

            this.eventService.emit({
                name: 'INVOICE_CANCELLED',
            });
        } catch (error) {
            this.pushNotification({
                type: 'error',
                title: gettext('Deposit'),
                message: gettext('Invoice cancellation failed. Please, try again later or contact support.'),
                wlcElement: 'notification_deposit-cancel-invoice-error',
            });
        }
    }

    private async balanceAction(
        systemId: number,
        amount: number,
        additionalFields: TAdditionalParams,
        method: TPaymentsMethods,
        requestName: string,
        cssVariables: string,
        wallet: ISelectedWallet,
    ): Promise<any> {
        try {
            const currentSystem = this.getSystemById(systemId);

            if (currentSystem.isCashier) {
                await this.injector.get(PIQCashierService).openPIQCashier(
                    method,
                    currentSystem,
                    amount,
                    (additionalFields['bonusId'] ? String(additionalFields['bonusId']) : null),
                    cssVariables,
                );
                return [PIQCashierResponse];
            }

            let res: IData;

            if (wallet) {
                res = await this.dataService.request<IData>(requestName, {
                    systemId,
                    amount,
                    additional: additionalFields,
                    walletCurrency: wallet.walletCurrency,
                    wallet: wallet.walletId,
                });
            } else {
                res = await this.dataService.request<IData>(requestName, {
                    systemId,
                    amount,
                    additional: additionalFields,
                });
            }
            return res.data;
        } catch (error) {
            error.sytemId = systemId;
            this.logService.sendLog({
                code: method === 'deposit' ? '17.0.1' : '17.0.2',
                flog: {
                    error,
                },
            });
            return Promise.reject(error);
        }
    }

    private createPaymentSystems(data: IPaymentSystem[]): PaymentSystem[] {
        const paymentSystems: PaymentSystem[] = [];

        if (data.length) {
            for (const paymentData of data) {
                paymentSystems.push(this.createPaymentSystem(paymentData));
            }
        }

        return paymentSystems;
    }

    private createPaymentSystem(data: IPaymentSystem, invoicesSystems?: PaymentSystem[]): PaymentSystem {

        const categoriesConfig: TPaySystemCategoriesConfig =
            this.configService.get<IFinancesConfig>('$finances').paySystemCategories?.categoriesConfig;

        data.tags = data.tags?.filter(
            (tag: TPaySystemTag): boolean => !!categoriesConfig[tag],
        );

        const paymentSystem: PaymentSystem = new PaymentSystem(
            {service: 'FinancesService', method: 'createPaymentSystems'},
            data,
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}),
        );

        if (invoicesSystems) {
            paymentSystem.children = invoicesSystems;
        }

        return paymentSystem;
    }

    private watchForUserTags(): void {
        const targetTag: string = this.configService.get<string>('$finances.checkUserTags.tag');

        this.configService.get<BehaviorSubject<UserInfo>>('$user.userInfo$')
            .pipe(filter((userInfo) => !!userInfo))
            .subscribe((userInfo: UserInfo): void => {
                this._isDepositBlocked$.next(userInfo.checkTagExists(targetTag));
            });
    }

    private createTransactions(data: ITransaction[]): Transaction[] {
        const transactions: Transaction[] = [];
        if (data.length) {
            for (const transaction of data) {
                transactions.push(new Transaction(
                    {service: 'FinancesService', method: 'createTransactions'},
                    transaction,
                ));
            }
        }
        return transactions;
    }

    private pushNotification(params: IPushMessageParams): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: params,
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'paymentSystems',
            system: 'finances',
            url: '/paymentSystems',
            type: 'GET',
            events: {
                success: 'PAYMENT_SYSTEMS',
                fail: 'PAYMENT_SYSTEMS_ERROR',
            },
        });
        this.dataService.registerMethod({
            name: 'deposits',
            system: 'finances',
            url: '/deposits',
            type: 'POST',
            events: {
                fail: 'DEPOSIT_ERROR',
            },
        });
        this.dataService.registerMethod({
            name: 'cancelDeposit',
            system: 'finances',
            url: '/deposits',
            type: 'DELETE',
            events: {
                success: 'CANCEL_INVOICE',
                fail: 'CANCEL_INVOICE_ERROR',
            },
        });
        this.dataService.registerMethod({
            name: 'postWithdrawal',
            system: 'finances',
            url: '/withdrawals',
            type: 'POST',
            events: {
                success: 'WITHDRAW_POST',
                fail: 'WITHDRAW_ERROR',
            },
        });
        this.dataService.registerMethod({
            name: 'getWithdrawal',
            system: 'finances',
            url: '/withdrawals',
            type: 'GET',
            events: {
                success: 'WITHDRAW_GET',
                fail: 'WITHDRAW_ERROR',
            },
        });
        this.dataService.registerMethod({
            name: 'getPendingWithdraws',
            system: 'finances',
            url: '/transactions',
            params: {status: 0},
            type: 'GET',
            mapFunc: this.createTransactions.bind(this),
            events: {
                success: 'WITHDRAWS_GET_PENDING',
                fail: 'WITHDRAWS_GET_PENDING_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'getDepWager',
            system: 'finances',
            url: '/reports?report=v2/Reports/DepositWagerProgress',
            type: 'GET',
            events: {
                success: 'DEPOSIT_WAGER_REPORT_GET',
                fail: 'DEPOSIT_WAGER_REPORT_ERROR',
            },
        });
    }
}

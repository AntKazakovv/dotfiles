import {
    Injectable,
    Injector,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
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
import {
    LanguageChangeEvents,
    UserProfile,
} from 'wlc-engine/modules/user';
import {TAdditionalParams} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';
import {PIQCashierService} from 'wlc-engine/modules/finances/system/services/piq-cashier/piq-cashier.service';
import {
    PaymentSystem,
    IPaymentSystem,
    FilterType,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    Transaction,
    ITransaction,
    ITransactionRequestParams,
} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {
    PIQCashierResponse,
    TPaymentsMethods,
} from 'wlc-engine/modules/finances/system/interfaces/piq-cashier.interface';
import {cryptoInvoiceSystem} from 'wlc-engine/modules/finances/system/constants/crypto-invoices.constants';
import {FinancesHelper} from 'wlc-engine/modules/finances/system/helpers/finances.helper';

interface IQueries {
    amount: number;
    queries: number;
}

@Injectable({providedIn: 'root'})
export class FinancesService {

    public paymentSystems$: BehaviorSubject<PaymentSystem[]> = new BehaviorSubject(undefined);

    private systems: PaymentSystem[] = [];
    private isPaymentsFetch: boolean = false;

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected injector: Injector,
        protected translateService: TranslateService,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected logService: LogService,
    ) {
        this.registerMethods();

        this.translateService.onLangChange.subscribe(() => {
            this.paymentSystems$.next(undefined);
            this.systems = [];
        });

        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.fetchPaymentSystems();
        });

        this.eventService.subscribe({name: LanguageChangeEvents.ChangeLanguage}, () => {
            this.fetchPaymentSystems();
        });

    }

    public get paymentSystems(): PaymentSystem[] {
        return this.systems;
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
    ): Promise<any> {
        return await this.balanceAction(
            systemId,
            amount,
            additionalFields,
            'deposit',
            'finances/deposits',
            cssVariables,
        );
    }

    public async withdraw(
        systemId: number,
        amount: number,
        additionalFields: IIndexing<string | number>,
        cssVariables: string,
    ): Promise<any> {
        return await this.balanceAction(
            systemId,
            amount,
            additionalFields,
            'withdraw',
            'finances/postWithdrawal',
            cssVariables,
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

    /**
     * Confirm withdraw by user
     *
     * @param {id} - transaction id
     *
     * @returns {Promise<IData>}
     */
    public async confirmWithdrawal(id: number): Promise<IData> {
        return await this.dataService.request<IData>({
            name: 'confirmWithdrawal',
            system: 'finances',
            url: '/withdrawals/complete',
            type: 'PATCH',
            params: {id},
            events: {
                success: 'TRANSACTION_CONFIRM',
                fail: 'TRANSACTION_CONFIRM_FAIL',
            },
        });
    }

    public async getTransactionList(params: ITransactionRequestParams = {}): Promise<Transaction[]> {
        return (await this.dataService.request<IData>('finances/transactions', params)).data as Transaction[];
    }

    public async fetchPaymentSystems(): Promise<PaymentSystem[]> {

        if (this.isPaymentsFetch) {
            return;
        }

        this.isPaymentsFetch = true;

        this.systems =
            this.createPaymentSystems((await this.dataService.request<IData>('finances/paymentSystems'))
                .data as IPaymentSystem[]);

        // TODO delete when will be completed #247624
        this.systems = this.systems.filter(system => !system.alias.includes('helper'));

        this.isPaymentsFetch = false;

        this.paymentSystems$.next(this.paymentSystems);
        return this.paymentSystems;
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

        const parentSystem: PaymentSystem = new PaymentSystem(
            {helper: 'FinancesService', method: 'updateForCryptoInvoices'},
            _merge({}, cryptoInvoiceSystem, this.configService.get('$finances.cryptoInvoices.paySystemParams')),
            this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}),
        );

        parentSystem.isParent = true;
        parentSystem.children = invoicesSystems;

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
     * Requests last success deposit method
     *
     * @returns {number} `number` - method id or null
     */
    public async getLastSucceedDepositMethod(): Promise<number | null> {

        try {
            const result: IData<string> = await this.dataService.request({
                name: 'lastDepositSucceedMethod',
                system: 'finances',
                url: '/lastSuccessfulDeposit',
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

    private async cancelInvoice(systemId: number): Promise<void> {
        try {
            await this.dataService.request('finances/cancelDeposit', {systemId});

            this.fetchPaymentSystems();

            this.pushNotification({
                type: 'success',
                title: gettext('Deposit'),
                message: gettext('Invoice has been successfully canceled.'),
                wlcElement: 'notification_deposit-cancel-invoice-success',
            });

            if (this.modalService.getActiveModal('payment-message')) {
                this.modalService.hideModal('payment-message');
            }
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
        additionalFields: object,
        method: TPaymentsMethods,
        requestName: string,
        cssVariables: string,
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

            const res = await this.dataService.request<IData>(requestName, {
                systemId,
                amount,
                additional: additionalFields,
            });
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private createPaymentSystems(data: IPaymentSystem[]): PaymentSystem[] {
        const paymentSystems: PaymentSystem[] = [];

        if (data.length) {
            for (const paymentData of data) {
                const system: PaymentSystem = new PaymentSystem(
                    {service: 'FinancesService', method: 'createPaymentSystems'},
                    paymentData,
                    this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'}),
                );
                paymentSystems.push(system);
            }
        }

        return paymentSystems;
    }


    private createTransaction(data: ITransaction[]): Transaction[] {
        return data.map((item) => new Transaction(
            {service: 'FinancesService', method: 'createTransaction'},
            item,
        ));
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
            name: 'transactions',
            system: 'finances',
            url: '/transactions',
            type: 'GET',
            events: {
                success: 'TRANSACTIONS',
                fail: 'TRANSACTIONS_ERROR',
            },
            mapFunc: this.createTransaction.bind(this),
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
    }
}

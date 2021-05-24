import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {
    DataService,
    IData,
    EventService,
} from 'wlc-engine/modules/core/system/services';
import {
    IBet,
    PIQCashierConvertedMethod,
    PIQCashierResponse,
} from 'wlc-engine/modules/finances/system/interfaces';
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
import {PIQCashierService} from 'wlc-engine/modules/finances/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {FinancesHelper} from '../../helpers/finances.helper';

import _find from 'lodash-es/find';
import _startsWith from 'lodash-es/startsWith';

interface ICancelWithdrawParams {
    id: number;
}

interface IQueries {
    amount: number;
    queries: number;
}

@Injectable({providedIn: 'root'})
export class FinancesService {

    public paymentSystems$: BehaviorSubject<PaymentSystem[]> = new BehaviorSubject(undefined);

    protected systems: PaymentSystem[] = [];

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected userService: UserService,
        protected injector: Injector,
    ) {
        this.registerMethods();
        this.fetchPaymentSystems();

        this.eventService.subscribe({name: 'LOGIN'},() => {
            this.fetchPaymentSystems();
        });
    }

    public get paymentSystems(): PaymentSystem[] {
        return this.systems;
    }

    public getSystemById(systemId: number): PaymentSystem {
        return this.systems.length ? _find(this.systems, {'id': systemId}) : null;
    }

    public async deposit(systemId: number, amount: number, additionalFields: object): Promise<any> {
        try {
            if (await this.checkPIQCashier(systemId, amount, PIQCashierConvertedMethod.deposit)) {
                return [PIQCashierResponse];
            }
            const res = await this.dataService.request<IData>('finances/deposits', {
                systemId,
                amount,
                additional: additionalFields,
            });
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async withdraw(systemId: number, amount: number, additionalFields: object): Promise<any> {
        try {
            if (await this.checkPIQCashier(systemId, amount, PIQCashierConvertedMethod.withdraw)) {
                return [PIQCashierResponse];
            }
            const res = await this.dataService.request<IData>('finances/postWithdrawal', {
                systemId,
                amount,
                additional: additionalFields,
            });
            return res.data;
        } catch (error) {
            return Promise.reject(error);
        }
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

    public async getTransactionList(params: ITransactionRequestParams = {}): Promise<Transaction[]> {
        return (await this.dataService.request<IData>('finances/transactions', params)).data as Transaction[];
    }

    public async getBetsList(params: any= {}): Promise<IBet[]> {
        return (await this.dataService.request<IData>('finances/bets', params)).data;
    }

    public async fetchPaymentSystems(): Promise<PaymentSystem[]> {
        this.systems = (await this.dataService.request<IData>('finances/paymentSystems')).data as PaymentSystem[];
        this.paymentSystems$.next(this.paymentSystems);
        return this.paymentSystems;
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

    /**
     * Check payment system if it is PaymentIQ Cashier and init
     * deposit/withdraw via cashier if yes
     *
     * @param {number} systemId - payment system object
     * @param {number} amount - deposit/withdraw amount
     * @param {PIQCashierConvertedMethod} method - type of payment method
     *
     * @return {Promise<boolean>} true if paysystem is PIQCashier system
     */

    public async checkPIQCashier(
        systemId: number,
        amount: number,
        method: PIQCashierConvertedMethod,
    ): Promise<boolean> {
        const currentSystem = this.getSystemById(systemId);
        if (_startsWith(currentSystem.alias, 'paymentiq_cashier')) {
            await this.injector.get(PIQCashierService).openPIQCashier(method, currentSystem, amount);
            return true;
        }
        return false;
    }

    protected createPaymentSystems(data: IPaymentSystem[]): PaymentSystem[] {
        const paymentSystems: PaymentSystem[] = [];

        if (data.length) {
            for (const paymentData of data) {
                const system: PaymentSystem = new PaymentSystem(paymentData, this.userService);
                paymentSystems.push(system);
            }
        }

        return paymentSystems;
    }


    protected createTransaction(data: ITransaction[]): Transaction[] {
        return data.map((item) => new Transaction(item));
    }

    protected registerMethods(): void {
        this.dataService.registerMethod({
            name: 'paymentSystems',
            system: 'finances',
            url: '/paymentSystems',
            type: 'GET',
            events: {
                success: 'PAYMENT_SYSTEMS',
                fail: 'PAYMENT_SYSTEMS_ERROR',
            },
            mapFunc: this.createPaymentSystems.bind(this),
        });
        this.dataService.registerMethod({
            name: 'bets',
            system: 'finances',
            url: '/bets',
            type: 'GET',
            events: {
                success: 'BETS',
                fail: 'BETS_ERROR',
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
                success: 'DEPOSIT',
                fail: 'DEPOSIT_ERROR',
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

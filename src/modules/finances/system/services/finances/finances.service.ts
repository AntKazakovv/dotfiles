import {Injectable} from '@angular/core';
import {IData, IRequestMethod, RestMethodType} from 'wlc-engine/modules/core/system/services/data/data.service';
import {DataService, EventService} from 'wlc-engine/modules/core/system/services';
import {PaymentSystem, IPaymentSystem, FilterType} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {Transaction, ITransaction, ITransactionRequestParams} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {BehaviorSubject} from 'rxjs';

import {
    find as _find,
} from 'lodash';
import {FinancesHelper} from '../../helpers/finances.helper';

interface ICancelWithdrawParams {
    id: number;
}
@Injectable({providedIn: 'root'})
export class FinancesService {

    public paymentSystems$: BehaviorSubject<PaymentSystem[]> = new BehaviorSubject(undefined);

    protected systems: PaymentSystem[] = [];

    constructor(
        protected dataService: DataService,
        protected eventService: EventService,
        protected userService: UserService,
    ) {
        this.registerMethods();
        this.fetchPaymentSystems();
    }

    public get paymentSystems(): PaymentSystem[] {
        return this.systems;
    }

    public getSystemById(systemId: number): PaymentSystem {
        return this.systems.length ? _find(this.systems, {'id': systemId}) : null;
    }

    public async deposit(systemId: number, amount: number, additionalFields: object): Promise<any> {
        try {
            const res = await this.dataService.request('finances/deposits', {
                systemId,
                amount,
                additional: additionalFields,
            });
            return res;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async withdraw(systemId: number, amount: number, additionalFields: object): Promise<any> {
        try {
            const res = await this.dataService.request('finances/withdrawals', {
                systemId,
                amount,
                additional: additionalFields,
            });
            return res;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public getWithdrawQueries(): Promise<any> {
        return null;

    }

    public checkWithdraw(systemId: number): Promise<any> {
        return null;

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

    public getBetsList(params: any): Promise<any> {
        return null;
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
            name: 'withdrawals',
            system: 'finances',
            url: '/withdrawals',
            type: 'POST',
            events: {
                success: 'WITHDRAW',
                fail: 'WITHDRAW_ERROR',
            },
        });
    }
}

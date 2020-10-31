import {Injectable} from '@angular/core';
//import {IIndexingtring} from 'wlc-engine/interfaces';
import {IRequestMethod, RestMethodType} from 'wlc-engine/modules/core/services/data/data.service';
import {DataService, EventService} from 'wlc-engine/modules/core/services';
import {PaymentSystem, IPaymentSystem, FilterType} from 'wlc-engine/modules/finances/models/payment-system.model';
import {IIndexing} from 'wlc-engine/interfaces';
import {UserService} from 'wlc-engine/modules/user/services/user.service';

import {
    find as _find,
} from 'lodash';

@Injectable()
export class FinancesService {

    protected systems: PaymentSystem[] = [];
    protected depositType: FilterType[] = ['deposit', 'Deposits', 'all', 'All'];
    protected withdrawType: FilterType[] = ['withdraw', 'Withdraws', 'all', 'All']

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

        if(this.systems.length) {
            return _find(this.systems, {'id': systemId});
        }

        return null;
    }

    public deposit(systemId: number, amount: number, additionalFields: object): Promise<any> {
        return null;

    }

    public withdraw(systemId: number, amount: number, additionalFields: object): Promise<any> {
        return null;

    }

    public getWithdrawQueries(): Promise<any> {
        return null;

    }

    public checkWithdraw(systemId: number): Promise<any> {
        return null;

    }

    public cancelWithdrawal(id: number): Promise<any> {
        return null;

    }

    /* public getTransactionList(params: any): Promise<ITransaction[]> {
        return null;

    } */

    public getBetsList(params: any): Promise<any> {
        return null;


    }

    public async fetchPaymentSystems(): Promise<PaymentSystem[]> {
        this.systems = await this.request<PaymentSystem[]>(
            'finances/paymentSystems',
            'PAYMENT_SYSTEMS',
            'PAYMENT_SYSTEMS_ERROR',
            null,
            this.createPaymentSystems,
        );
        return this.paymentSystems;
    }

    /* public getPaymentSystemInfo(): Promise<IPaymentSystemInfo[]> {
        return null;

    } */

    public filterSystems(filterType: FilterType = 'all'): PaymentSystem[] {
        return this.systems.filter((system: PaymentSystem) => {
            return (this.depositType.includes(system.showFor) && this.depositType.includes(filterType))
                || (this.withdrawType.includes(system.showFor) && this.withdrawType.includes(filterType));
        });
    }

    protected createPaymentSystems(data: IPaymentSystem[]): PaymentSystem[] {
        const paymentSystems: PaymentSystem[] = [];

        if (data.length) {
            for(const paymentData of data) {
                const system: PaymentSystem = new PaymentSystem(paymentData, this.userService);
                paymentSystems.push(system);
            }
        }

        return paymentSystems;
    }

    protected async request<T>(
        name: string,
        event: string,
        eventError: string,
        params: IIndexing<string> = {},
        callback?: (data?: unknown) => T,
    ): Promise<T> {
        try {
            const data = (await this.dataService.request(name, params)).data;
            this.eventService.emit({
                name: event,
                data: data,
            });

            if (callback) {
                return callback(data);
            }

            return data;
        } catch (error) {
            this.eventService.emit({
                name: eventError,
                data: error,
            });
        }
    }

    protected regMethod(
        name: string,
        url: string,
        type: RestMethodType,
    ): void {
        const params: IRequestMethod = {name, system: 'finances', url, type};
        this.dataService.registerMethod(params);
    }

    protected registerMethods(): void {
        this.regMethod('paymentSystems', '/paymentSystems', 'GET');
        this.regMethod('bets', '/bets', 'GET');
        this.regMethod('transactions', '/transactions', 'GET');
        this.regMethod('deposits', '/deposits', 'POST');
        this.regMethod('withdrawals', '/withdrawals', 'POST');
    }
}

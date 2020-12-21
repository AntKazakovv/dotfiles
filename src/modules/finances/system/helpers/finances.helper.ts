import {PaymentSystem} from "../models/payment-system.model";

type FilterType = 'deposit' | 'Deposits' | 'withdraw' | 'Withdraws' | 'all' | 'All';

export class FinancesHelper {
    private static depositType: FilterType[] = ['deposit', 'Deposits', 'all', 'All'];
    private static withdrawType: FilterType[] = ['withdraw', 'Withdraws', 'all', 'All'];

    public static isDeposit(value: FilterType): boolean {
        return this.checkType(true, value);
    }

    public static isWithdraw(value: FilterType): boolean {
        return this.checkType(false, value);
    }

    public static checkSystemType(system: PaymentSystem, filterType: FilterType): boolean {
        return (FinancesHelper.isDeposit(system.showFor) && FinancesHelper.isDeposit(filterType))
        || (FinancesHelper.isWithdraw(system.showFor) && FinancesHelper.isWithdraw(filterType));
    }

    private static checkType(isDeposit: boolean, value: FilterType): boolean {
        if (isDeposit) {
            return this.depositType.includes(value);
        } else {
            return this.withdrawType.includes(value);
        }
    }
}

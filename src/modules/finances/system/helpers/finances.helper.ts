import {PaymentSystem} from '../models/payment-system.model';
import {ValidatorType, IIndexing} from 'wlc-engine/modules/core';

import _isString from 'lodash-es/isString';


type FilterType = 'deposit' | 'Deposits' | 'withdraw' | 'Withdraws' | 'all' | 'All';

export class FinancesHelper {
    private static depositType: FilterType[] = ['deposit', 'Deposits', 'all', 'All'];
    private static withdrawType: FilterType[] = ['withdraw', 'Withdraws', 'all', 'All'];
    /**
     * Object with special validators fot additional fields.
     *
     * `key` - additional field key
     *
     * `validators` - list of validators settings
     */
    private static validators: IIndexing<ValidatorType[]> = {
        withdraw_account: [
            {
                name: 'pattern',
                options: '^[a-zA-Z0-9:]*$',
                text: gettext('Cryptocurrency wallet address is incorrect'),
            },
            {
                name: 'minLength',
                options: 8,
            },
        ],
    };

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

    public static errorToMessage(error: {errors?: any}): string | string[] {
        return error.errors?.length
            ? error.errors.filter((i: unknown) => _isString(i))
            : gettext('Something went wrong. Please try again later.');
    }

    /**
     * Additional fields validators
     * @param fieldKey additional field key value
     * @returns list of field validators
     */
    public static getSpecialValidators(fieldKey: string): ValidatorType[] {
        return this.validators[fieldKey] || [];
    }

    private static checkType(isDeposit: boolean, value: FilterType): boolean {
        if (isDeposit) {
            return this.depositType.includes(value);
        } else {
            return this.withdrawType.includes(value);
        }
    }
}

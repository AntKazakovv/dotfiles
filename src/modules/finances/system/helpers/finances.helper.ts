import _isString from 'lodash-es/isString';
import _uniq from 'lodash-es/uniq';

import {
    GlobalHelper,
    IData,
    IIndexing,
} from 'wlc-engine/modules/core';
import {TPaySystemTagAll} from 'wlc-engine/modules/finances/system/interfaces/finances.interface';

import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {IErrorContextFormatMessage} from 'wlc-engine/modules/core/system/services/data/data.service';
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

    /**
     * Looks for the context time in the error and brings it to locale
     *
     * @param {IErrorContextFormatMessage} error
     *
     * @returns findContextInMessage method | error text
     */
    public static newFormatErrorToMessage(error: IData): string {
        if (error.errors && !Array.isArray(error.errors)) {
            const errorMessage: string = (error.errors as IErrorContextFormatMessage)?.error?.message;
            const context: IIndexing<string> = (error.errors as IErrorContextFormatMessage)?.error?.context;

            // Regular expression checks that the string is in the format YYYY-MM-DD HH:mm:ss
            if (context.time && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(context.time)) {
                context.time = GlobalHelper.toLocalTime(context.time, 'SQL', 'YYYY-MM-DD HH:mm:ss');
            }

            return GlobalHelper.findContextInMessage(context, errorMessage);
        } else {
            gettext('Something went wrong. Please try again later.');
        }
    }

    public static errorToMessage(error: {errors?: any}): string | string[] {
        return  error.errors?.length
            ? error.errors.filter((i: unknown) => _isString(i))
            : gettext('Something went wrong. Please try again later');
    }

    /**
     * Creates array of uniq systems tags
     * @param systems payment systems collection
     * @returns array of systems tags
     */
    public static collectTags(systems: PaymentSystem[]): TPaySystemTagAll[] {
        return _uniq(systems.reduce<TPaySystemTagAll[]>(
            (acc: TPaySystemTagAll[], system: PaymentSystem) => [...acc, ...system.tags],
            [],
        ));
    }

    private static checkType(isDeposit: boolean, value: FilterType): boolean {
        if (isDeposit) {
            return this.depositType.includes(value);
        } else {
            return this.withdrawType.includes(value);
        }
    }
}

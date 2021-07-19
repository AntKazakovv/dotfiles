import {PaymentSystem} from '../models/payment-system.model';
import {ValidatorType, IIndexing} from 'wlc-engine/modules/core';

import _isString from 'lodash-es/isString';
import _find from 'lodash-es/find';


type FilterType = 'deposit' | 'Deposits' | 'withdraw' | 'Withdraws' | 'all' | 'All';

interface ISpecialValidators {
    aliasBase?: string;
    default?: boolean;
    validators: ValidatorType[] | ISpecialValidators[];
}

export class FinancesHelper {
    private static depositType: FilterType[] = ['deposit', 'Deposits', 'all', 'All'];
    private static withdrawType: FilterType[] = ['withdraw', 'Withdraws', 'all', 'All'];
    /**
     * Object with special validators fot additional fields.
     *
     * `key` - additional field key
     *
     * `validators` - list of validators settings
     *
     * `aliasBase` - is used to specify validators via payment system alias
     *
     * `default` - if aliasBase is used, default must contains fallback validators for non included aliases
     */
    private static validators: IIndexing<ISpecialValidators> = {
        withdraw_account: window.WLC_ENV ? null : {
            validators: [
                { // BCH
                    aliasBase: 'paycryptos_bitcoincash',
                    validators: [
                        {
                            name: 'pattern',
                            options: '^((bitcoincash:)?(q|p)[a-z0-9]{41})$',
                        },
                    ],
                },
                { // BTC
                    aliasBase: 'paycryptos_bitcoin',
                    validators: [
                        {
                            name: 'pattern',
                            options: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
                        },
                    ],
                },
                { // LTC
                    aliasBase: 'paycryptos_litecoin',
                    validators: [
                        {
                            name: 'pattern',
                            options: '^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$',
                        },
                    ],
                },
                { // DOGE
                    aliasBase: 'paycryptos_dogecoin',
                    validators: [
                        {
                            name: 'pattern',
                            options: '^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$',
                        },
                    ],
                },
                { // TRX, USDT (Tron)
                    aliasBase: '_tron',
                    validators: [
                        {
                            name: 'pattern',
                            options: '^(T)[a-zA-HJ-NP-Z0-9]{33}$',
                        },
                    ],
                },
                {
                    default: true,
                    validators: [ // USDT, ETH
                        {
                            name: 'pattern',
                            options: '^0x[a-fA-F0-9]{40}$',
                        },
                    ],
                },
            ],
        },
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
     * @param alias payment system alias (to specify validators)
     * @returns list of field validators
     */
    public static getSpecialValidators(fieldKey: string, alias?: string): ValidatorType[] {
        const fieldValidators = this.validators[fieldKey];
        if (fieldValidators) {
            if (fieldValidators.validators.some((elem) => elem['aliases'] || elem['default'])) {
                const elemValidators: ISpecialValidators = _find(
                    (fieldValidators.validators as ISpecialValidators[]),
                    (elem: ISpecialValidators) => alias.includes(elem.aliasBase) || elem.default);
                return elemValidators.validators as ValidatorType[];
            } else {
                return fieldValidators.validators as ValidatorType[];
            }
        } else {
            return [];
        }
    }

    private static checkType(isDeposit: boolean, value: FilterType): boolean {
        if (isDeposit) {
            return this.depositType.includes(value);
        } else {
            return this.withdrawType.includes(value);
        }
    }
}

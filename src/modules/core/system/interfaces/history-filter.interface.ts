import {BehaviorSubject} from 'rxjs';
import {DateTime} from 'luxon';
import {
    IRadioButtonsCParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';

export type TTransactionFilter = 'all' | 'deposit' | 'withdraw';
export type TTournamentsFilter = 'all' | '-95' | '-99' | '99' | '100' | '0' | '1';
export type TBonusFilter = 'all' | '-100' | '-99' | '100';
export type TTransactionFilterType = ISelectCParams<TTransactionFilter> | IRadioButtonsCParams<TTransactionFilter>;

export interface IHistoryData {
    transaction: BehaviorSubject<IFinancesFilter>;
    bet: BehaviorSubject<IFinancesFilter>;
    tournaments: BehaviorSubject<IFilterValue<TTournamentsFilter>>;
    bonus: BehaviorSubject<IFilterValue<TBonusFilter>>;
};

export interface IFilterValue<T = string> {
    filterValue: T;
}

export interface IHistoryDefault {
    transaction: IFinancesFilter<TTransactionFilter>;
    bet: IFinancesFilter;
    tournaments: IFilterValue<TTournamentsFilter>;
    bonus: IFilterValue<TBonusFilter>
}
export interface IFinancesFilter<T = string> {
    filterValue?: T;
    startDate?: DateTime;
    endDate?: DateTime;
}

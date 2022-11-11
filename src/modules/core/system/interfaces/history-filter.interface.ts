import {BehaviorSubject} from 'rxjs';
import {DateTime} from 'luxon';
import {
    IRadioButtonsCParams,
    ISelectCParams,
    TSortDirection,
} from 'wlc-engine/modules/core';

export type TTransactionFilter = 'all' | 'deposit' | 'withdraw';
export type TTournamentsFilter = 'all' | '-95' | '-99' | '99' | '100' | '0' | '1';
export type TBonusFilter = 'all' | '-100' | '-99' | '100';
export type TTransactionFilterType = ISelectCParams<TTransactionFilter> | IRadioButtonsCParams<TTransactionFilter>;

export interface IHistoryData {
    transaction: BehaviorSubject<IHistoryFilter>;
    bet: BehaviorSubject<IHistoryFilter>;
    tournaments: BehaviorSubject<IHistoryFilterValue<TTournamentsFilter>>;
    bonus: BehaviorSubject<IHistoryFilterValue<TBonusFilter>>;
    mails: BehaviorSubject<IHistoryFilter>;
};

export interface IHistoryFilterValue<T = string> {
    filterValue: T;
}

export interface IHistoryDefault {
    transaction: IHistoryFilter<TTransactionFilter>;
    bet: IHistoryFilter;
    tournaments: IHistoryFilterValue<TTournamentsFilter>;
    bonus: IHistoryFilterValue<TBonusFilter>;
    mails: IHistoryFilter;
}
export interface IHistoryFilter<T = string> {
    filterValue?: T;
    orderDirection?: TSortDirection;
    startDate?: DateTime;
    endDate?: DateTime;
}

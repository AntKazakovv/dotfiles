import {BehaviorSubject} from 'rxjs';
import {DateTime} from 'luxon';
import {TSortDirection} from 'wlc-engine/modules/core';

export type TTransactionFilter = 'all' | 'deposit' | 'withdraw' | 'transfer';
export type TTournamentsFilter = 'all' | '-95' | '-99' | '99' | '100' | '0' | '1';
export const TBonusFilter: Record<string, string> = {
    'all': 'all',
    '-100': 'Expired',
    '-99': 'Canceled',
    '100': 'Wagered',
    '90': 'Canceled (insufficient balance)',
    '-102': 'Not used',
    '-50': 'Canceled by administrator',
    '-101': 'Unsubscribed',
    '0': 'Subscribed',
    '1': 'Activated',
    '2': 'Inventoried',
} as const;

export interface IHistoryData {
    transaction: BehaviorSubject<IHistoryFilter>;
    bet: BehaviorSubject<IHistoryFilter>;
    tournaments: BehaviorSubject<IHistoryFilterValue<TTournamentsFilter>>;
    bonus: BehaviorSubject<IHistoryFilterValue<typeof TBonusFilter>>;
    mails: BehaviorSubject<IHistoryFilter>;
};

export interface IHistoryFilterValue<T = Record<string, string>> {
    filterValue: T;
}

export interface IHistoryDefault {
    transaction: IHistoryFilter<TTransactionFilter>;
    bet: IHistoryFilter;
    tournaments: IHistoryFilterValue<TTournamentsFilter>;
    bonus: IHistoryFilterValue<keyof typeof TBonusFilter>;
    mails: IHistoryFilter;
}
export interface IHistoryFilter<T = string> {
    filterValue?: T;
    orderDirection?: TSortDirection;
    startDate?: DateTime;
    endDate?: DateTime;
}

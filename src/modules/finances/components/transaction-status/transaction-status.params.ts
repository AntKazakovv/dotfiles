import {IComponentParams, CustomType} from 'wlc-engine/classes/abstract.component';
import {Transaction} from 'wlc-engine/modules/finances/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionStatusParams extends IComponentParams<Theme, Type, ThemeMod> {
    transaction?: Transaction;
}

export const defaultParams: ITransactionStatusParams = {
    class: 'wlc-transaction-status',
};

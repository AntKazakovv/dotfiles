import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionButtonsParams extends IComponentParams<Theme, Type, ThemeMod> {
    transaction?: Transaction;
}

export const defaultParams: ITransactionButtonsParams = {
    class: 'wlc-transaction-buttons',
};

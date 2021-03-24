import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {IBet} from "wlc-engine/modules/finances/system/interfaces";

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionPreviewParams extends IComponentParams<Theme, Type, ThemeMod> {
    transaction?: IBet | Transaction;
    index?: number;
}

export const defaultParams: ITransactionPreviewParams = {
    class: 'wlc-transaction-preview',
};

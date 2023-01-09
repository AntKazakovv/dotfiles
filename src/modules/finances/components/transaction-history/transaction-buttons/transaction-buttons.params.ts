import {IButtonCParams, IComponentWithPendingBtns} from 'wlc-engine/modules/core';
import {CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface ITransactionButtonsParams extends IComponentWithPendingBtns<Theme, Type, ThemeMod> {
    transaction?: Transaction;
    btnsParams: {
        cancelBtnParams?: IButtonCParams;
        confirmBtnParams?: IButtonCParams;
    }
}

export const defaultParams: ITransactionButtonsParams = {
    class: 'wlc-transaction-buttons',
    btnsParams: {
        cancelBtnParams: {
            themeMod: 'secondary',
            common: {
                text: 'Cancel',
                typeAttr: 'button',
            },
        },
        confirmBtnParams: {
            themeMod: 'secondary',
            common: {
                text: 'Confirm',
                typeAttr: 'button',
            },
        },
    },
};

import {IComponentParams, CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type Theme = 'default' | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default'  | CustomType;

export interface IPaymentListParams extends IComponentParams<Theme, Type, ThemeMod> {
    paymentType?: 'deposit' | 'withdraw';
}

export const defaultParams: IPaymentListParams = {
    paymentType: 'deposit',
    class: 'wlc-payment-list',
};

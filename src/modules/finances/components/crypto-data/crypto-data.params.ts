import {PaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | 'modal' | CustomType;

export interface ICryptoDataCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    class: string;
    system?: PaymentSystem;
};

export const defaultParams: ICryptoDataCParams = {
    class: 'wlc-crypto-data',
};

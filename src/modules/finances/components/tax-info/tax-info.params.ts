import {Subject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ICalculatedTax {
    tax: number;
    totalAmount: number;
};

export interface ITaxInfoCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    amount$?: Subject<number>
    mode?: TPaymentsMethods;
};

export const defaultParams: ITaxInfoCParams = {
    class: 'wlc-tax-info',
    componentName: 'wlc-tax-info',
    moduleName: 'finances',
};

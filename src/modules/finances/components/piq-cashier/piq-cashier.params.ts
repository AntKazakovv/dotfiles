import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IPIQCashierCParams extends IComponentParams<string, string, string> {}

export const defaultParams: IPIQCashierCParams = {
    moduleName: 'finances',
    componentName: 'wlc-piq-cashier',
    class: 'wlc-piq-cashier',
};

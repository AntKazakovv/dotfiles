import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces';

export interface IPIQCashierCParams extends IComponentParams<string, string, string> {
    /**
     * payments methods
     */
    mode: TPaymentsMethods;
    /**
     * open in modal
     * setting in PIQCashierService 
     */
    modal?: boolean;
}

export const defaultParams: IPIQCashierCParams = {
    moduleName: 'finances',
    componentName: 'wlc-piq-cashier',
    class: 'wlc-piq-cashier',
    mode: 'deposit',
};

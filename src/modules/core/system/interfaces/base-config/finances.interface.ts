import {IPIQCashierTheme} from 'wlc-engine/modules/finances';

export interface IFinancesConfig {
    depositInIframe?: boolean;
    /**
     * Config for cashier payments
     */
    piqCashier?: {
        /**
         * Config for customize by [constructor]{@link https://pay.paymentiq.io/cashier-config/}
         */
        theme?: IPIQCashierTheme;
    };
}

import {IPIQCashierTheme} from 'wlc-engine/modules/finances';

export interface IPIQCashier {
    /**
     * Config for customize by [constructor]{@link https://pay.paymentiq.io/cashier-config/}
     */
    theme?: IPIQCashierTheme;
    /**
     * Prevents the user from navigating back and forward via browser navigation.
     */
    blockBrowserNavigation?: boolean;
    /**
     * Fetch cashier config from PaymentIQ Backoffice
     */
    fetchConfig?: boolean;
}

export interface IFinancesConfig {
    depositInIframe?: boolean;
    /**
     * Config for cashier payments
     */
    piqCashier?: IPIQCashier;
}

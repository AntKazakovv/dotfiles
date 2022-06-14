import {Theme as IPiqCashierTheme} from 'paymentiq-cashier-bootstrapper';

export interface IPIQCashier {
    /**
     * Config for customize by [constructor]{@link https://pay.paymentiq.io/cashier-config/}
     */
    theme?: IPiqCashierTheme;
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
    /**
     * Enable redirects and notifications after deposit bonus activation
     */
    redirectAfterDepositBonus?: boolean;
}

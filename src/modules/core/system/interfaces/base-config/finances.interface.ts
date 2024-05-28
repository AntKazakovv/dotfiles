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
     /**
     * Height for iframe (default value is 'auto')
     */
    containerHeight?: string;
}

export interface IMetamaskConfig {
    /** `true` by default. Close payment message modal on success deposit via metamask */
    hidePayMessageModalOnSuccess?: boolean;
}

export interface IFinancesConfig {
    /**
     * Config for cashier payments
     */
    piqCashier?: IPIQCashier;
    /**
     * Enable redirects and notifications after deposit bonus activation
     */
    redirectAfterDepositBonus?: boolean;
    /**
     * Metamask payment options
     */
    metamask?: IMetamaskConfig;
    /**
     * Enable display widget to cancel last pending withdrawal, will be moved to fundist settings
     * after release SCR #520408
     */
    lastWithdrawCancelWidget?: boolean;
}

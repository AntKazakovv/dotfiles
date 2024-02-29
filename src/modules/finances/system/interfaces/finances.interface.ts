import {
    IIndexing,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {IPaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {TPaymentsMethods} from 'wlc-engine/modules/finances/system/interfaces/piq-cashier.interface';
import {TAlertMod} from 'wlc-engine/modules/chat/components/chat-panel/components/alert/alert.component';

export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
    payment?: IPaySystemAutoSelect;
    paymentInfo?: IPaymentInfo;
    bonusesInDeposit?: IDepositBonusAutoSelect;
    cryptoInvoices?: ICryptoInvoicesParams;
    /**
     * Enable selecting last succeed deposit method.
     * Can be enabled regardless another autoSelect options and has highest priority.
     */
    lastSucceedDepositMethod?: {
        use?: boolean;
    };
    /**
     * Enable selecting last succeed withdraw method.
     * Can be enabled regardless another autoSelect options and has highest priority.
     */
    lastSucceedWithdrawMethod?: {
        use?: boolean;
    };
    paySystemCategories?: IPaySystemCategories;
    /**
     * Additional & required fields settings config
     */
    fieldsSettings?: IFieldsSettings;
    transactionHistoryAlert?: ITransactionHistoryAlert;
    /** Add scrollbar if true (for second theme of deposit-withdraw) */
    usePaySystemScroll?: boolean;
    /**
     * Config for preselected amount buttons both in deposit and withdraw
     */
    preselectButtons?: IPreselectedButtonsConfig;
    /**
     * If true, promocode form adds to deposit form.
     * For now, works only with second template
     * */
    useDepositPromoCode?: boolean;
    /**
     * Notification for deposit and/or withdrawal
     */
    alerts?: IAlerts;
    /**
     * The default initial amount from the "Preselected payment amount" field will be added to the amount entry form
     */
    useDefaultAmount?: boolean;
    // TODO удалить после готовности бэка 539575
    availableSystemsForOldTC?: string[];
    newTermsVersion?: string;
}

export interface ITransactionHistoryAlert {
    show: boolean,
    title?: string,
    text?: string,
}

export type IAmountCustomValidators = Record<TPaymentsMethods, ValidatorType[]>

export interface IFieldsSettings {
    /**
     * Additional fields settings
     * `key` - key of additional field
     */
    additional?: IIndexing<IAdditionalFieldConfig>;
    amount?: {
        /** Custom validators for amount field.
         * How to use:
         * 1. Define your custom validation function in $base.forms.customValidators
         * 2. Set name of your custom function in $finances.fieldSettings.amount
         * 3. Add translates for new errors
         *
         * @example
         * // $base.forms
         * customValidators: {
         *     customValidationFnDep: (control) => {
         *        return (Number(control.value) % 10) ? {'multiple': true} : null;
         *     },
         * }
         *
         * // $finances.fieldsSettings.amount
         * customValidators: {
         *      deposit: ['customValidationFnDep']
         * }
        */
        customValidators?: Partial<IAmountCustomValidators>;
    }
}

export interface IAdditionalFieldConfig {
    /**
     * Default settings for field
     */
    default?: IAdditionalFieldSettings;
    /**
     * Various settings for field by country and system
     */
    settings?: IAdditionalFieldSettingsCustom[];
}

export interface IAdditionalFieldSettings {
    /**
     * Tooltip for field
     */
    tooltip?: string;
    /**
     * Validators for field
     */
    validators?: ValidatorType[];
}

export interface IAdditionalFieldSettingsCustom extends IAdditionalFieldSettings {
    /**
     * An array of countries for which the rule is used.
     */
    countries?: string[];
    /**
     * An array of systems for which the rule is used.
     */
    systems?: string[];
}

export interface IPaySystemCategories {
    /**
     * Define if functionality is used
     */
    use?: boolean;
    /**
     * Define type of tags menu on desktop.
     * While setting is not defined:
     * `select` - is used for first profile,
     * `menu` - is used for default profile.
     */
    desktopMenuType?: TPaySystemsSwitcher;
    /**
     * Accept media query with min or max width only.
     * Used only if asModal for payment list is null.
     * Define media query before cat menu looks like dropdown.
     * By default: `(max-width: 479px)`
     */
    dropdownBefore?: string;
    /**
     * List of default tags.
     * Contains hardcode names and sort params.
     * Sort order is descending (the more value the higher position).
     * Can be partially redefined.
     */
    categoriesConfig?: Partial<Record<TPaySystemTagAll, IPaySystemTag>>;
}

export type TPaySystemsSwitcher = 'select' | 'menu';

export interface IPaySystemTag {
    name: string;
    order: number;
};

export type TPaySystemTag = 'recommended'
    | 'card_method'
    | 'e_wallet'
    | 'crypto'
    | 'direct_banking'
    | 'buy_crypto';

export type TPaySystemTagAll = TPaySystemTag | 'other';

export interface IFastDeposit {
    /** How many times show fast deposit modal per single game session */
    gamePlayShowLimit?: number;
    /** @deprecated - fast deposit logic will be managed by Fundist */
    use?: boolean;
}

export type TTranslate = 'pay_to_address' | 'pay_to_bank' | 'html';

export interface IPaymentMessage {
    amount?: string;
    translate?: TTranslate;
    address?: string;
    qrlink?: string;
    wallet_currency?: string;
    details?: string;
    tag?: string;
    x_address?: string;
    html?: string;
    scripts?: string[];
    copyItem?: string;
    rate?: string;
    memo?: string;
    /** Deposit amount in crypto currency (deposit via invoices) */
    cryptoAmount?: string;
    /** Deposit amount in user currency (deposit via invoices) */
    userAmount?: string;
    /** Crypto currency rate to user currency (deposit via invoices) */
    cryptoRate?: string;
    /** Date when invoice expires (deposit via invoices) */
    dateEnd?: string;
    metamask_account?: string;
}

export interface IPaySystemAutoSelect {
    autoSelect?: boolean;
    alias?: number | string | IAutoSelectByDevice<number | string>;
}

export interface IPaymentInfo {
    /** Auto scroll to payment info when choosing a payment system */
    autoScroll?: boolean;
    /** Hides payment info until selected payment system */
    hiddenPaymentInfo?: boolean;
}

export interface IDepositBonusAutoSelect {
    use?: boolean;
    autoSelect?: {
        use?: boolean,
        index?: number | IAutoSelectByDevice<number>;
    };
}

export interface IAutoSelectByDevice<T> {
    mobile?: T;
    desktop?: T;
}

export type TAdditionalParams = IIndexing<string | number> & {
    bonusId?: number;
    promoCode?: string;
};

export interface ICryptoInvoicesParams {
    paySystemParams?: TPaySystemParams;
};

export interface IPreselectedButtonsConfig {
    summationMode: boolean;
};

export type TPaySystemParams = Partial<Pick<IPaymentSystem, 'image' | 'description' | 'name'>>;

export interface ITaxItem {
    /** Top limit for current taxes */
    max_amount?: string;
    /** Fixed tax for part of sum */
    tax_amount?: string;
    /** Tax size in percents for (sum - fixedSum) */
    tax_percent: string;
    /** Part of sum with fixed tax (related to tax_amount field) */
    fixedSum?: number;
}

export interface ITaxData {
    withdraw: Record<string, ITaxItem>;
    deposit: Record<string, ITaxItem>;
    currency: string;
}

export interface IAlertMessage {
    title: string;
    mod: TAlertMod;
    description?: string;
}

export interface IAlerts {
    deposit?: TAlertList;
    withdraw?: TAlertList;
}

export type TAlertList = {
    [key in TShowMode]?: IAlertMessage;
}

export type TShowMode = 'title' | 'wallets' | 'bonuses' | 'cryptoInvoiceSystems' | 'paymentInfo' | 'systems';

export type TTechnicalTags = 'check_name_before_withdraw' | 'check_tc';

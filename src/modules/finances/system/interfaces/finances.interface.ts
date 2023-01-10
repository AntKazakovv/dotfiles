import {
    IIndexing,
    ValidatorType,
} from 'wlc-engine/modules/core';
import {
    IFieldTemplate,
    IPaymentSystem,
} from 'wlc-engine/modules/finances/system/models/payment-system.model';

export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
    fieldTemplatesNames?: IIndexing<IFieldTemplate>,
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
    paySystemCategories?: IPaySystemCategories;
    /**
     * Additional & required fields settings config
     */
    fieldsSettings?: IFieldsSettings;
}

export interface IFieldsSettings {
    /**
     * Additional fields settings
     * `key` - key of additional field
     */
    additional?: IIndexing<IAdditionalFieldConfig>;
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
    | 'direct_banking';

export type TPaySystemTagAll = TPaySystemTag | 'other';

export interface IFastDeposit {
    use: boolean;
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
    bonusId?: number | null;
};

export interface ICryptoInvoicesParams {
    paySystemParams?: TPaySystemParams;
};

export type TPaySystemParams = Partial<Pick<IPaymentSystem, 'image' | 'description' | 'name'>>;

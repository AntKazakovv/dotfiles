import {IPaymentSystem} from 'wlc-engine/modules/finances/system/models/payment-system.model';
import {IIndexing} from 'wlc-engine/modules/core';

export interface IFinancesConfig {
    fastDeposit: IFastDeposit;
    payment?: IPaySystemAutoSelect;
    bonusesInDeposit?: {
        use?: boolean;
        autoSelect?: {
            use?: boolean,
            index?: number | IAutoSelectByDevice<number>;
        };
    };
    cryptoInvoices?: ICryptoInvoicesParams;
}

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

export type TBets = IBet[];

export interface IBet {
    Amount: string;
    Currency: string;
    Date: string;
    DateISO: string;
    GameID: string;
    GameName: string;
    Merchant: string;
}

export interface IPaySystemAutoSelect {
    autoSelect: boolean;
    alias?: number | string | IAutoSelectByDevice<number | string>;
}

export interface IDepositBonusAutoSelect {
    autoSelect: boolean;
    index?: number | IAutoSelectByDevice<number>;
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

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

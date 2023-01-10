import {IIndexing} from 'wlc-engine/modules/core';

export type TLimitationType =
    | 'MaxDepositSum'
    | 'MaxBetSum'
    | 'MaxLossSum'
    | 'realityChecker'
    | 'timeOut';

export type TIndexingLimitTypeItems = IIndexing<ILimitationTypeItem>;

export interface ILimitationTypeItem {
    title: string;
    value: TLimitationType;
}

export interface ILimitationsConfig {
    /**
    * Enable/disable limitations
    */
    use: boolean;
    /**
    * Allows you to include some types of limits
    */
    limitTypes?: ILimitationTypeItem[];
}

import {IIndexing} from 'wlc-engine/modules/core';

export type TLimitationType =
    | 'MaxDepositSum'
    | 'MaxBetSum'
    | 'MaxLossSum'
    | 'realityChecker'
    | 'timeOut'
    | 'selfExclusion'
    | 'accountClosure';

export type TIndexingLimitTypeItems = IIndexing<ILimitationTypeItem>;

export interface ILimitationTypeItem {
    title: string;
    value: TLimitationType;
}
export interface ITimeOutLimitOption {
    title: string;
    /** Period value sets in days*/
    value: string;
}
export interface ILimitationsConfig {
    /**
    * Enable/disable limitations
    */
    use: boolean;
    realityChecker?: IRealityChecker;
    /**
    * Allows you to include some types of limits
    */
    limitTypes?: ILimitationTypeItem[];
    defaultLimitType?: TLimitationType;
    /** Set periods for time out limit */
    timeOutLimitOptions?: ITimeOutLimitOption[];
}

export interface IRealityChecker {
    autoApply?: boolean;
    /** Time in minutes */
    period?: number;
}

export interface IResultSelfExclusion {
    result: {
        loggedIn: string;
    }
}

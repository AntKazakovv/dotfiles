import {IIndexing} from 'wlc-engine/modules/core';
import {IBonusBase} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export interface IBonusHistory extends IBonusBase {
    BonusWagering: string;
    BonusWageringDiff: string;
    CancelInfo: IIndexing<string> | IIndexing<string>[];
    Ended: number;
    FreebetsValue: string;
    FreebetsWinning: string;
    FreeroundWagering: string;
    PaySystems: null;
    Start: string;
    SubscribeDate: string;
}

export type TBonusesHistory = IBonusHistory[];

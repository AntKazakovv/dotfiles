import {IIndexing} from 'wlc-engine/modules/core';

export type TLotteryWinningSpread = Record<string, string>;
export type TRawLotteryBonusPrize = Record<string, string>;

/**
 * notStarted - эмиссия билетов еще не стартовала
 * active - активная лотерея, период выдачи билетов
 * ending - активная лотерея, период выдачи билетов закончился
 * ended - завершенная лотерея
 */
export type TLotteryStatus = 'notStarted' | 'active' | 'ending' | 'ended';
export type TLotteryStatusCode = -100 | -1 | 1 | 100;
export type TLotteryPrizeType = 'goods' | 'bonus';

export type IBonusPrize = {
    value: string;
    currency: string;
}

export interface ILotteriesModule {
    results?: {
        usersPerPlace?: number;
    }
}

export interface ILotteriesResponse {
    lotteries: ILottery[];
}

export interface ILotteriesHistoryResponse {
    lotteries: ILotteryBase[];
}

export interface ILotteryFetchParams {
    alias?: string;
    wallet?: string;
    usersPerPlace?:number;
}

export interface ILotteryImages {
    main: string;
    description: string;
}

export interface ILotteryPrize {
    type: TLotteryPrizeType;
    simpleValue?: string;
    bonusValue?: IBonusPrize[];
}

export interface ILotteryPrizeRow {
    place: number;
    prize: ILotteryPrize;
}

export interface ILotteryResultRow {
    user: string;
    isCurrent?: boolean;
}

export interface ILotteryBase {
    ID: number;
    Name: string;
    Alias: string;
    /** Date of summarizing the results */
    DrawingDate: string;
    Results: ILotteryResults[];
}

export interface ILottery extends ILotteryBase {
    Status: TLotteryStatusCode;
    Description: string;
    Terms: string;
    Images: ILotteryImages;
    Price: number;
    /** Start of ticket issuance */
    DateStart: string;
    /** End of ticket issuance */
    DateEnd: string;
    UserTicketsCount: number;
    Levels: string[];
    WinningSpread: IIndexing<TLotteryWinningSpread>;
}

/** Results row interface */
export interface ILotteryResults {
    Place: number;
    Prize: TLotteryWinningSpread;
    Users: IRawLotteryWinner[];
    TotalUsers: number;
}

/** Lottery winner data from server */
export interface IRawLotteryWinner {
    ID: number;
    Name: string;
}

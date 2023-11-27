export type TLotteryWinningSpread = Record<string, string>;
export type TRawLotteryBonusPrize = Record<string, string>;
export type TLotteryBonusPrize = {
    currency: string;
    value: string;
}

/**
 * notStarted - эмиссия билетов еще не стартовала
 * active - активная лотерея, период выдачи билетов
 * ending - активная лотерея, период выдачи билетов закончился
 * ended - завершенная лотерея
 */
export type TLotteryStatus = 'notStarted' | 'active' | 'ending' | 'ended';
export type TLotteryPrizeType = 'goods' | 'bonus';

export interface ILotteryImages {
    main: string;
    description: string;
}

export interface ILotteryPrize {
    place: number;
    type: TLotteryPrizeType;
    value: string | number;
    currency?: string;
}

export interface ILottery {
    ID: number;
    Status: 1 | 0;
    Name: string;
    Alias: string;
    Description: string;
    Terms: string;
    Images: ILotteryImages;
    Price: number;
    DateStart: string;
    DateEnd: string;
    UserTicketsCount: number;
    Levels: string[];
    WinningSpread: TLotteryWinningSpread[];
}

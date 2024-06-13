export interface ILocalJackpot {
    id: number;
    name: string;
    description: string;
    accumulatedAmount: number;
    restrictions: ILocalJackpotRestrictions;
}

export interface ILocalJackpotRestrictions {
    categories: {
        allowed?: number[];
        restricted?: number[];
    }
}

export interface IWSDataJackpotWon {
    Amount: string;
    AmountConverted: string;
    BetAmount: string;
    BetAmountOrig: string;
    IDApi: number;
    IDBet: number;
    IDGame: number;
    IDJackpot: number;
    IDNet: number;
    IDParent: number;
    IDStall: number;
    IDUser: number;
    Node: number;
    dwh_event_id: string;
    odb_event_id: number;
    timestamp: string;
    timestamp_ms: number;
}

export interface ILocalJackpotsData {
    data: ILocalJackpot[];
    status: string;
}

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

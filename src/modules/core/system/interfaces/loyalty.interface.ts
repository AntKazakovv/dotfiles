import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

export interface ILoyalty {
    Balance?: string;
    Block?: number;
    BonusRestrictions?: any;
    BonusesBalance: IIndexing<IBonusesBalance>;
    CheckDate?: string;
    ConfirmPoints?: string;
    Country?: string;
    Currency?: string;
    DepositsCount?: string;
    DuplicateLevel?: string;
    ForbidBonuses?: string;
    ForbidLoyaltyPoints?: string;
    ForbidTournaments?: string;
    IDUser?: string;
    Language?: string;
    Level?: string;
    LevelCoef?: string;
    LevelName: any;
    LevelUp?: boolean;
    Login?: string;
    NextLevelPoints?: string;
    Points?: string;
    TotalBets?: string;
    TotalPoints?: string;
}

export interface IFreeRound {
    IDMerchant: string;
    Count: string;
    Games: string[];
    ExpireDate: string;
    BetLevel: string;
    Coins: any;
    AddDate: string;
    Additional: any;
}

export interface IBonusesBalance {
    Balance?: string,
    IDLoyaltyBonuses?: string,
    Merchants?: string[],
    RestrictSettings?: string[],
}

import {IIndexing} from 'wlc-engine/modules/core';
import {
    PartialObserver,
    Observable,
    Subject,
} from 'rxjs';
import {Bonus} from '../models/bonus';

import {BonusesListNoContentByThemeType} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';

export interface IBonusesModule {
    useIconBonusImage?: boolean;
    components?: {
        'wlc-bonuses-list': {
            noContent: BonusesListNoContentByThemeType,
        },
    },
}

export interface IBonus {
    Active: number;
    AffiliateSystem: string;
    AffiliateUrl: string;
    AllowCatalog: string;
    AllowStack: string;
    AwardWageringTotal: number;
    AmountMax: IIndexing<string>;
    AmountMin: IIndexing<string>;
    Balance: number | string;
    Block: string;
    Bonus: string;
    BonusAwarded: string;
    BonusBalance: string;
    BonusType: string;
    BonusWinning: string;
    CategoriesRestrictType?: string;
    Currency: string;
    Description: string;
    DisableCancel: string;
    Date: string;
    Event: string;
    EventAmount: string;
    ExperienceAction: string;
    ExperiencePoints: string;
    Expire: string;
    ExpireDate: string;
    ExpireDays: string;
    ExpireAction: string;
    End: string;
    Ends: string;
    FreeroundComplete: string;
    FreeroundCount: string;
    FreeRoundWagering: string;
    FreeroundWinning: string;
    GamesRestrictType?: string;
    Group: string;
    ID: number | string;
    IDActivator: string;
    IDCategories: string[];
    IDGames: string[];
    IDPiFilter: string;
    Image: string;
    Image_other: string;
    Image_promo: string;
    Image_reg: string;
    Image_store: string;
    Inventoried: number;
    IsInventory: string;
    LBID: string;
    Limitation: string;
    LoyaltyPoints: string;
    MaxBet: IIndexing<string>;
    MinBet: IIndexing<string>;
    Name: string;
    PromoCode: string | number;
    PromoCodeUsed: string;
    RealWinning: string;
    ReleaseWageringTotal: number;
    Results: any;
    Selected: number;
    SportSettings: string;
    Status: string | number;
    Starts: string;
    Target: string;
    Terms: string;
    TotalWinning: string;
    Type: string;
    Wagering: number;
    WageringLeft: string;
    WageringTo: string;
    WageringTotal: string;
    WageringType: string;
    Conditions?: IBonusConditions;
}

export interface IBonusConditions {
    Levels?: IIndexing<string>;
    PaySystems?: IIndexing<string>;
    Currencies?: IIndexing<string>;
    AmountMin?: IIndexing<string>;
    AmountMax?: IIndexing<string>;
    MaxBet?: IIndexing<string>;
    MinBet?: IIndexing<string>;
    MaxBonusWin?: IIndexing<string>;
    MaxBonusWinCoef?: string; // "500.00"
    SportCoeff?: string;
    Games?: IBonusConditionsGames;
    RegionRestrictType?: string; // "0" | "1"
    Countries?: IIndexing<string>;
    Languages?: IIndexing<string>;
    DuplicateLevel?: number[];
    WageringBetType?: 'all' | 'real';
    StrictDistribute?: string; // "0" | "1"
    DistributeBet?: string; // "89,11"
    DistributeWin?: string; // "equal" | "35,65"
    BetSettings?: any;
    DisallowActivationOnWithdrawal?: string; // "0" | "1"
}

export interface IBonusConditionsGames {
    Rtp: any;
    Merchants: any;
    Games: any;
    Categories: any;
    Sport: any;
    Leagues: any;
    MarketsBL: any;
}

export interface IQueryParams {
    type?: string;
    event?: string;
    PromoCode?: string;
}

export interface IGetSubscribeParams {
    useQuery: boolean;
    observer: PartialObserver<Bonus[]>;
    type?: RestType;
    until?: Observable<unknown>;
    ready$?: Subject<boolean>;
}

export type IBonusType = 'default' | 'reg' | 'deposit' | 'promo' | 'store' | 'other' | 'blank';
export type BonusesFilterType = 'all' | 'reg' | 'deposit' | 'promocode' | 'inventory' | 'main' | 'active' | 'default';
export type RestType = 'active' | 'history' | 'store' | 'any';
export type ActionType = 'inventory' | 'cancel' | 'subscribe' | 'unsubscribe';

interface IBlankBonus {
    id: null
}

export enum ChosenBonusSetParams {
    ChosenBonus = 'CHOSEN_BONUS',
}

export type ChosenBonusType = Bonus | IBlankBonus;

export enum BonusItemComponentEvents {
    reg = 'CHOOSE_REG_BONUS_SUCCEEDED',
    blank = 'UNCHOOSE_ANY_BONUS',
    deposit = 'CHOOSE_DEPOSIT_BONUS_SUCCEEDED',
    other = 'CHOOSE_OTHER_BONUS_SUCCEEDED',
}

import {IIndexing} from 'wlc-engine/modules/core';
import {
    PartialObserver,
    Observable,
    Subject,
} from 'rxjs';
import {Bonus} from '../models/bonus';

import {BonusesListNoContentByThemeType} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';

export interface IBonusesModule {
    /** combining Active bonuses and Offers into My bonuses **/
    unitedPageBonuses?: boolean;
    useIconBonusImage?: boolean;
    /** Enable on new image sources */
    useNewImageSources?: boolean;
    /** Default bonus icon path */
    defaultIconPath?: string;
    /** Default bonus fallback icon path */
    fallBackIconPath?: string;
    defaultImages?: {
        /** Bonus image for bonus in profile dashboard, profile bonuses, bonus block in main page  in default profile */
        image?: string;
        /**
         * Bonus image for bonus in profile dashboard, profile bonuses,
         * bonus block in main page, sign-up modal in first profile
        */
        imageProfileFirst?: string;
        /** Bonus image in promotions */
        imagePromo?: string;
        /** Bonus image in sign-up modal in default profile */
        imageReg?: string;
        /** Bonus image in header of bonus-modal when useNewImageSources: false*/
        imageOther?: string;
        /** Not used yet */
        imageStore?: string;
        /** Bonus image in promo-home */
        imagePromoHome?: string;
        /** Bonus image in blank bonus in sign-up modal in profile default */
        imageBlank?: string;
        /** Dummy bonus image */
        imageDummy?: string;
        /** Bonus image in header of bonus-modal when useNewImageSources: true*/
        imageDescription?: string;
    };
    components?: {
        'wlc-bonuses-list': {
            noContent: BonusesListNoContentByThemeType,
        },
    };
}

export type TBonusEvent =
    | 'deposit first'
    | 'registration'
    | 'verification'
    | 'deposit'
    | 'deposit repeated'
    | 'deposit sum'
    | 'bet sum'
    | 'bet'
    | 'win sum'
    | 'loss sum'
    | 'level up'
    | 'sign up'
    | 'store'
    | 'promotion';

export interface IBonusBase {
    AwardWageringTotal: number;
    Balance: number | string;
    Block: string;
    Bonus: string | IBonus;
    BonusAwarded: string;
    BonusType: string;
    Currency: string;
    Description: string;
    Event: TBonusEvent;
    ExperiencePoints: string;
    End: string;
    FreeroundCount: string;
    FreeroundWinning: string;
    Group: string;
    ID: number | string;
    IDActivator: string;
    Image: string;
    Image_other: string;
    Image_promo: string;
    Image_reg: string;
    Image_store: string;
    Image_main: string;
    Image_description: string;
    LBID: string;
    LoyaltyPoints: string;
    Name: string;
    PromoCodeUsed: string;
    ReleaseWageringTotal: number;
    Status: string | number;
    Target: string;
    Type: string;
    Wagering: number;
    WageringLeft: string;
    WageringTo: string;
    WageringTotal: string;
}

export interface IBonus extends IBonusBase {
    Active: number;
    AffiliateSystem: string;
    AffiliateUrl: string;
    AllowCatalog: string;
    AllowStack: string;
    AmountMax: IIndexing<string>;
    AmountMin: IIndexing<string>;
    BonusBalance: string;
    BonusWinning: string;
    CategoriesRestrictType?: string;
    DisableCancel: string;
    Date: string;
    EventAmount: string;
    ExperienceAction: string;
    Expire: string;
    ExpireDate: string;
    ExpireDays: string;
    ExpireAction: string;
    Ends: string;
    FreeroundComplete: string;
    FreeRoundWagering: string;
    GamesRestrictType?: string;
    IDCategories: string[];
    IDGames: string[];
    IDPiFilter: string;
    Inventoried: number;
    IsInventory: string;
    Weight: string;
    Limitation: string;
    MaxBet: IIndexing<string>;
    MinBet: IIndexing<string>;
    Name: string;
    PaySystems: string[];
    PromoCode: string | number;
    RealWinning: string;
    Results: any;
    Selected: number;
    SportSettings: string;
    Starts: string;
    Terms: string;
    TotalWinning: string;
    WageringType: string;
    Conditions?: IBonusConditions;
}

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

export type TBonusSortOrder = 'active' | 'promocode' | 'subscribe' | 'inventory' | number;
export type BonusesFilterType = 'all' | 'reg' | 'deposit' | 'promocode' | 'inventory' | 'main' | 'active' | 'default';
export type RestType = 'active' | 'history' | 'store' | 'any';
export type ActionType = 'inventory' | 'cancel' | 'expired' | 'subscribe' | 'unsubscribe';

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

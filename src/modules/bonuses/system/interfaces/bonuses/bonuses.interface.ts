import {IIndexing} from 'wlc-engine/modules/core';
import {
    PartialObserver,
    Observable,
    Subject,
} from 'rxjs';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {BonusesListNoContentByThemeType} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';

export interface IBonusesModule {
    /** combining Active bonuses and Offers into My bonuses **/
    unitedPageBonuses?: boolean;
    useIconBonusImage?: boolean;
    /** Enable on new image sources */
    useNewImageSources?: boolean;
    /** Default bonus icon path */
    defaultIconPath?: string;
    /** Default bonus icon extension */
    defaultIconExtension?: 'svg' | 'png';
    /** Default bonus fallback icon path */
    fallBackIconPath?: string;
    /** Unavailable bonus icon path */
    showOnlyIconPath?: string;
    defaultImages?: {
        /** Bonus image for bonus in profile dashboard, profile bonuses, bonus block in main page in default profile */
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
        /** Bonus image TODO*/
        imageDeposit?: string;
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

export type TBonusTarget =
    | 'balance'
    | 'experience'
    | 'freebets'
    | 'freerounds'
    | 'loyalty'
    | 'lootbox'
    | '';

export type TBonusResultValueType = 'absolute' | 'relative';

export interface IBonusResultValue {
    Type?: TBonusResultValueType;
    Value?: IIndexing<string> | number[] | string;
    AwardWagering?: {
        COEF?: string;
        EUR?: number;
    };
    LimitValue?: IIndexing<string>;
    BetLevel?: string;
    Coins?: string;
    ReleaseWagering?: string;
    WageringType?: string;
}

export interface IBonusResultValueDefault extends IBonusResultValue {
    Value?: IIndexing<string>;
}

export interface IBonusResultValueFreerounds extends IBonusResultValue {
    Value?: string;
}

export interface IBonusResultValueLootbox extends IBonusResultValue {
    Value?: number[];
}

export interface IBonusResults {
    balance?: IBonusResultValueDefault;
    experience?: IBonusResultValueDefault;
    freebets?: IBonusResultValueDefault;
    loyalty?: IBonusResultValueDefault;
    freerounds?: IBonusResultValueFreerounds;
    lootbox?: IBonusResultValueLootbox;
};

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
    Image_deposit: string;
    LBID: string;
    LoyaltyPoints: string;
    Name: string;
    PromoCodeUsed: string;
    ReleaseWageringTotal: number;
    Status: string | number;
    Target: TBonusTarget;
    Type: TBonusResultValueType;
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
    Results: IBonusResults;
    Selected: number;
    SportSettings: string;
    Starts: string;
    Terms: string;
    TotalWinning: string;
    WageringType: string;
    Conditions?: IBonusConditions;
    /** Show/hide bonus in Promo ("0" | "1") */
    AllowPromotions?: string;
    /** Show/hide bonus in Promo for unauthorized user (available in combination witn AllowPromotions) ("0" | "1") */
    HidePromotionsForUnauthorized?: string;
    showOnly?: boolean;
}

export interface ILootboxPrize {
    ID: number;
    Name: string;
    Image: string;
    Description: string;
    Terms: string;
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

export type TBonusSortOrder = 'active' | 'promocode' | 'subscribe' | 'inventory' | number;
export type BonusesFilterType =
    | 'all'
    | 'reg'
    | 'deposit'
    | 'promocode'
    | 'inventory'
    | 'main'
    | 'active'
    | 'united'
    | 'default';
export type RestType = 'active' | 'lootboxPrizes' | 'store' | 'any';
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

/**
 * Information about the loss of funds when canceling the bonus for the player.
 */
export interface IBonusCanceledInfo {
    /**
     * The amount will burn on the bonus balance
     */
    BurnOnBonusBalance: string;
    /**
     * The amount will burn on the real balance
     */
    BurnOnRealBalance: string;
    /**
     * The amount that will be transferred to the player's real balance
     */
    TransferredToRealBalance: string;
    /**
     * Amount required for wagering.
     */
    AmountToCompleteWagering: string;
    /**
     * Value currency
     */
    Currency: string;
}

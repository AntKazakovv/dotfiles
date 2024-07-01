import {
    PartialObserver,
    Observable,
    OperatorFunction,
} from 'rxjs';

import {
    IIndexing,
} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {
    TFreeRoundGames,
} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {
    TournamentsListNoContentByThemeType,
} from 'wlc-engine/modules/tournaments/components/tournament-list/tournament-list.params';
import {
    MarathonNoContentByThemeType,
} from 'wlc-engine/modules/tournaments/components/marathon/marathon.params';
import {ITagCommon, ITagList} from 'wlc-engine/modules/core/components/tag/tag.params';
import {
    Tournament,
    League,
    Marathon,
} from 'wlc-engine/modules/tournaments';

export interface IMarathonComponentConfig {
    noContent: MarathonNoContentByThemeType;
}

export interface ITournamentsComponents {
    'wlc-tournament-list'?: {
        noContent: TournamentsListNoContentByThemeType,
    },
    'wlc-marathon'?: IMarathonComponentConfig,
}

export interface ITournamentGames {
    Categories: number[];
    CategoriesBL: number[];
    Games: number[] | string[];
    GamesBL: number[];
    Merchants: number[];
    MerchantsBL: number[];
}

export interface ITournamentResponse {
    data: ITournament[];
}

export interface ITournamentAbstract {
    BetMax: IIndexing<string>;
    BetMin: IIndexing<string>;
    Description: string;
    FeeAmount: IIndexing<string | number> | string;
    FeeType: 'balance' | 'loyalty';
    FreeroundGames?: TFreeRoundGames;
    Games?: ITournamentGames;
    ID: string | number;
    Image: string;
    Image_dashboard?: string;
    Image_description?: string;
    Image_promo?: string;
    Image_other?: string;
    Name: string;
    WinnerBy: TWinnerBy;
    WinToBetRatio: string | null;
    Terms: string;
    Target: TTournamentTarget;
    Status: string;
    Series: string;
    Qualification: string;
    PointsTotal: string;
    Points?: string;
    StatusText?: string;
}

export type TCurrency = string | number | Record<string, number> | IIndexing<string | number>
    | IIndexing<IIndexing<number | string> | string | number> | [];

export interface ITotalFounds {
    EUR: string | number;
    Currency: TCurrency;
}

export interface IWinningSpread {
    Currency: TCurrency[];
    EUR: number[];
    Percent: string[];
}

export interface ITournament extends ITournamentAbstract {
    AllowStack: '0' | '1' | '2' | null;
    OnlyForLevels: string[];
    ShowOnly?: number;
    CurrentTime: number;
    Ends: string;
    TournamentType: TTournamentType;
    Games: ITournamentGames;
    PointsLimit: string | number;
    PointsLimitMin: string | number;
    Qualified: number;
    RemainingTime: number;
    Repeat: string;
    Selected: number;
    Starts: string;
    TotalFounds: ITotalFounds;
    Type: 'absolute' | 'relative';
    Value: string;
    WinningSpread: IWinningSpread;
    AdditionalFreerounds?: IAdditionalFreeSpins;
    LTID?: number;
    PromoCodes?: '' | string[];
}

export interface IMarathon extends ITournament {
    Leagues?: ILeague[];
}

export interface ILeague extends ITournament {
    IDLeader?: string;
    IDParent?: number;
    PlayersCount?: string;
    PlayersTotalPoints?: string;
}

export interface ITopTournamentUsers {
    limit: number;
    results?: ITournamentPlace[];
    start: number;
    user?: ITournamentUser;
}

export type TPrizePodiumImages = Partial<Record<1 | 2 | 3, string>>;

export interface IPrizePodium {
    /** Show prize podium in tournament detail view */
    useOnDetail?: boolean;
    /** Images for prize podium */
    images?: TPrizePodiumImages;
}

export interface ITournamentsModule {
    components?: ITournamentsComponents;
    defaultImages?: {
        /** Tournament background image on home page */
        image?: string;
        /** Tournament image in tournaments */
        imagePromo?: string;
        /** Tournament image in game dashboard */
        imageDashboard?: string;
        /** Tournament image in tournaments-detail */
        imageDescription?: string;
        /** Tournament extra image to be displayed as decor over the main image on home page */
        imageOther?: string;
    },
    prizePodium?: IPrizePodium;
    /** Description for tooltip in prizeboard, when tournament target is bonus */
    bonusRewardText?: string;
    tagsConfig?: ITagList<TTournamentTagKey>;
    timerTextAfterStart?: string;
    timerTextBeforeStart?: string;
    lockBtnText?: string;
}

export interface ITournamentPlace {
    Email: string;
    FirstName: string;
    IDUser: string;
    IDUserPlace: string;
    LastName: string;
    Login: string;
    Points: string;
    UserLogin: string;
    Win: string;
    Currency?: string;
    WinEUR?: string;
    ScreenName?: string;
    points?: number;
    BestWinToBetRatio: string;
    delta?: number;
    Target?: string;
    TotalWins?: ITotalFounds;
    TotalWinsLB?: ITournamentPrize[];
}

export interface ITournamentUser {
    AddDate: string;
    Balance: string;
    BetsAmount: string;
    BetsCount: string;
    Currency: string;
    EndDate: string;
    ExRate: string;
    ID: string;
    IDLoyalty: string;
    IDTournament: string;
    IDUser: string;
    LastBet?: string;
    ManualPoints: string;
    Place: string;
    Points: number;
    PointsCoef: string;
    Qualification: string;
    Status: string;
    Win: string;
    WinsAmount: string;
    WinsCount: string;
    BestWinToBetRatio: string;
}

export interface ITournamentUserStats {
    money: number;
    played: number;
    wins: number;
}

export interface IGetSubscribeParams {
    useQuery: boolean;
    observer: PartialObserver<Tournament[]>;
    until: Observable<unknown>;
    pipes?: OperatorFunction<TTournamentModel[], unknown>;
    type?: RestType;
    tournamentType?: TTournamentType;
}

export interface IQueryParams {
    type?: string;
    currency?: string;
    TournamentType?: TTournamentType;
    PromoCode?: string;
}

export interface ITournamentPrize {
    value: number;
    currency: string;
}

export interface IPrizeRow {
    prize: ITournamentPrize[];
    place?: number;
}
export interface IJoinTournamentParams {
    ID: number;
    Selected: number;
    wallet?: number;
}

export interface ITournamentTags {
    useIcons: boolean;
    tagList?: Partial<Record<TTournamentTagKey, ITagCommon>>;
}

export interface IAdditionalFreeSpins {
    /**
     * Total number of free spins packages that can be purchased (taken from the Tournament settings)
     * Max - 5.
     */
    Packages: number;
    /**
     * Number of packages consumed. Packages - Used, we get the number of packages available for purchase
     */
    Used: number;
    /**
     * Number of free rounds in one package
     */
    FreeroundsInPackage: number;
    /**
     * Package price in various currencies
     */
    Price: ITotalFounds;
}

export interface IBuyFreeSpinsParams {
    ltid: number,
    merchant: string;
    wallet?: number;
}

export type RestType = 'active' | 'history' | 'any';
export type TTournamentType = 'general' | 'marathon' | 'league';
export type TTournamentModel = Tournament | Marathon | League;
export type TTournamentInterface = ITournament | IMarathon | ILeague;
export type ThumbType = 'default' | 'dashboard' | 'banner' | 'active' | 'profile' | 'available';
export type ActionType = 'join' | 'leave';
export type TTournamentTarget = 'balance' | 'loyalty' | 'bonus';
export type TTournamentTagKey = 'Active' | 'Available' | 'Coming soon' | 'Unavailable' | 'Ended' | '';

export enum TournamentEvents {
    buyFreeSpins = 'BUY_FREE_SPINS',
}

export type TWinnerBy = 'bets' | 'wins' | 'turnovers' | 'turnovers_loose' | 'max_win' | 'fr'
    | 'max_app_winbet_ratio' | 'winbet_ratio'

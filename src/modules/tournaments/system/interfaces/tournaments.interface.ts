import {
    IIndexing,
} from 'wlc-engine/modules/core';
import {Tournament} from '../models/tournament.model';
import {
    PartialObserver,
    Observable,
} from 'rxjs';
import {
    TournamentsListNoContentByThemeType,
} from 'wlc-engine/modules/tournaments/components/tournament-list/tournament-list.params';

export interface ITournamentsComponents {
    'wlc-tournament-list'?: {
        noContent: TournamentsListNoContentByThemeType,
    },
}

export interface ITournamentGames {
    Categories: number[];
    CategoriesBL: number[];
    Games: number[];
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
    ID: number;
    Image: string;
    Image_dashboard?: string;
    Image_description?: string;
    Image_promo?: string;
    Image_other?: string;
    Name: string;
    WinnerBy: 'bets' | 'wins' | 'turnovers' | 'turnovers_loose' | 'max_win' | 'fr';
    Terms: string;
    Target: 'balance' | 'loyalty';
    Status: string;
    Series: string;
    Qualification: string;
    PointsTotal: string;
    Points?: string;
    StatusText?: string;
}

export interface ITournamentHistory extends ITournamentAbstract {
    BetsAmount: string;
    BetsCount: string;
    End: string;
    Place: string;
    Start: string;
    Win: string;
    WinningSpreadCount: number;
    WinsAmount: string;
    WinsCount: string;
}

export interface ITournament extends ITournamentAbstract {
    CurrentTime: number;
    Ends: string;
    Games: ITournamentGames;
    PointsLimit: string | number;
    PointsLimitMin: string | number;
    Qualified: number;
    RemainingTime: number;
    Repeat: string;
    Selected: number;
    Starts: string;
    TotalFounds: IIndexing<string>;
    Type: 'absolute' | 'relative';
    Value: string;
    WinningSpread: IIndexing<string[] | number[]>;
}

export interface ITopTournamentUsers {
    limit: number;
    results: ITournamentPlace[];
    start: number;
    user: ITournamentUser;
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
    }
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
    Win: number;
    WinEUR?: string;
    points?: number;
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
    LastBet: string;
    ManualPoints: string;
    Place: string;
    Points: number;
    PointsCoef: string;
    Qualification: string;
    Status: string;
    Win: string;
    WinsAmount: string;
    WinsCount: string;
}

export interface ITournamentUserStats {
    money: number;
    played: number;
    wins: number;
}

export interface IGetSubscribeParams {
    useQuery: boolean;
    observer: PartialObserver<Tournament[]>;
    type?: RestType;
    until?: Observable<unknown>;
}

export interface IQueryParams {
    type?: string;
}

export type RestType = 'active' | 'history' | 'any';
export type ThumbType = 'default' | 'dashboard' | 'banner' | 'active' | 'profile' | 'available';
export type ActionType = 'join' | 'leave';

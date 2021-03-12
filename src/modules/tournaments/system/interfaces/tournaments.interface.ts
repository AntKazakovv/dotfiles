import {
    IIndexing,
} from 'wlc-engine/modules/core';
import {Tournament} from '../models/tournament';
import {
    PartialObserver,
    Observable,
} from 'rxjs';

export interface ITournamentGames {
    Categories: number[];
    CategoriesBL: number[];
    Games: number[];
    GamesBL: number[];
    Merchants: number[];
    MerchantsBL: number[];
}

export interface ITournament {
    BetMax: IIndexing<string>;
    BetMin: IIndexing<string>;
    CurrentTime: number;
    Description: string;
    Ends: string;
    FeeAmount: IIndexing<string> | string;
    FeeType: 'balance' | 'loyalty';
    Games: ITournamentGames;
    ID: number;
    Image: string;
    Image_dashboard: string;
    Image_description: string;
    Image_promo: string;
    Image_other: string;
    Name: string;
    PointsLimit: string;
    PointsLimitMin: string;
    PointsTotal: string;
    Qualification: string;
    Qualified: number;
    RemainingTime: number;
    Repeat: string;
    Selected: number;
    Series: string;
    Starts: string;
    Status: string;
    Target: 'balance' | 'loyalty';
    Terms: string;
    TotalFounds: IIndexing<string>;
    Type: 'absolute' | 'relative';
    Value: string;
    WinnerBy: 'bets' | 'wins' | 'turnovers' | 'turnovers_loose' | 'max_win' | 'fr';
    WinningSpread: IIndexing<string[]>;
}

export interface ITopTournamentUsers {
    limit: number;
    results: ITournamentPlace[];
    start: number;
    user: ITournamentUser;
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

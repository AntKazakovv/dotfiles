import {
    IIndexing,
    ISetParams,
} from 'wlc-engine/modules/core';
import {
    PartialObserver,
    Observable,
} from 'rxjs';
import {Tournament} from '../models/tournament';

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
    results: ITounamentPlace[];
    start: number;
    user: ITournamentUser;
}

export interface ITounamentPlace {
    Email: string;
    FirstName: string;
    IDUser: number;
    IDUserPlace: string;
    LastName: string;
    Login: string;
    Points: number;
    UserLogin: string;
    Prize?: number;
}

export interface ITournamentUser {
    AddDate: string;
    Balance: number;
    BetsAmount: number;
    BetsCount: number;
    Currency: string;
    EndDate: string;
    ExRate: number;
    ID: number;
    IDLoyalty: number;
    IDTournament: number;
    IDUser: number;
    LastBet: any;
    ManualPoints: number;
    Place: number;
    Points: number;
    PointsCoef: number;
    Qualification: number;
    Status: number;
    Win: any;
    WinsAmount: number;
    WinsCount: number;
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

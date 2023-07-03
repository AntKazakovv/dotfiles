import {
    ITotalFounds,
    ITournamentAbstract,
    ITournamentPrize,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

export interface ITournamentWinsParams {
    history?: boolean,
    wins?: ITournamentPrize[],
}

export interface ITournamentHistory extends ITournamentAbstract {
    BetsAmount: string;
    BetsCount: string;
    End: string | null;
    Place: string | null;
    Start: string;
    TotalWins: ITotalFounds;
    Win: string | null;
    WinningSpreadCount: number;
    WinsAmount: string;
    WinsCount: string;
}

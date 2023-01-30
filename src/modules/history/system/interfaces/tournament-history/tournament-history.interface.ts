import {ITournamentAbstract} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

export interface ITournamentHistory extends ITournamentAbstract {
    BetsAmount: string;
    BetsCount: string;
    End: string | null;
    Place: string | null;
    Start: string;
    Win: string | null;
    WinningSpreadCount: number;
    WinsAmount: string;
    WinsCount: string;
}

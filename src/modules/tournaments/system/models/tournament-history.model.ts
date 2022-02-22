import _toNumber from 'lodash-es/toNumber';
import _assign from 'lodash-es/assign';

import {
    ConfigService,
    GlobalHelper,
    IFromLog,
} from 'wlc-engine/modules/core';
import {AbstractTournamentModel} from 'wlc-engine/modules/tournaments/system/models/abstract-tournament.model';
import {ITournamentHistory} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';

export class TournamentHistory extends AbstractTournamentModel<ITournamentHistory> {

    constructor(
        from: IFromLog,
        data: ITournamentHistory,
        configService: ConfigService,
        tournamentsService: TournamentsService,
    ) {
        super(
            {from: _assign({model: 'TournamentHistory'}, from)},
            data,
            configService,
            tournamentsService,
        );
    }

    public get place(): string | number {
        return _toNumber(this.data.Place) || '#';
    }

    public get start(): string {
        return GlobalHelper.toLocalTime(this.data.Start, 'SQL', 'yyyy-MM-dd HH:mm:ss');
    }

    public get end(): string {
        return GlobalHelper.toLocalTime(this.data.End, 'SQL', 'yyyy-MM-dd HH:mm:ss');
    }

    public get win(): string {
        return this.data.Win || '-';
    }

    public get betsAmount(): string {
        return this.data.BetsAmount;
    }

    public get betsCount(): string {
        return this.data.BetsCount;
    }

    public get winningSpreadCount(): number {
        return this.data.WinningSpreadCount;
    }

    public get winsAmount(): string {
        return this.data.WinsAmount;
    }

    public get winsCount(): string {
        return this.data.WinsCount;
    }
}

import {
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    ILeague,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';

export class League extends Tournament<ILeague> {
    public readonly playersCount!: number;
    public readonly playersTotalPoints!: number;

    constructor(
        from: IFromLog,
        data: ILeague,
        configService: ConfigService,
        tournamentsService: TournamentsService,
    ) {
        super(
            {...from, model: 'League'},
            data,
            configService,
            tournamentsService,
        );

        this.playersCount = +this.data.PlayersCount || 0;
        this.playersTotalPoints = +this.data.PlayersTotalPoints || 0;
    }
}

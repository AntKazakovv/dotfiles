import {
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    ILeague,
    IMarathon,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';

export class Marathon extends Tournament<IMarathon> {
    public readonly leagues!: League[];

    constructor(
        from: IFromLog,
        data: IMarathon,
        configService: ConfigService,
        tournamentsService: TournamentsService,
    ) {
        super(
            {...from, model: 'Marathon'},
            data,
            configService,
            tournamentsService,
        );

        this.leagues = data.Leagues
            ?.filter((league: ILeague): boolean => !['-1', '-100'].includes(league.Status))
            .map((league: ILeague): League => {
                return new League(
                    {model: 'Marathon', method: 'constructor'},
                    league,
                    configService,
                    tournamentsService,
                );
            }) ?? [];
    }
}

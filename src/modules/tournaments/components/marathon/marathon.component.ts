import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    inject,
} from '@angular/core';

import {
    BehaviorSubject,
    interval,
    pipe,
    skip,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ModalService,
    EventService,
    IWrapperCParams,
    ITableCParams,
    ITableCol,
    INoContentCParams,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {
    ILeagueInfoCParams,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-info/league-info.params';
import {
    ILeagueStatusCParams,
} from 'wlc-engine/modules/tournaments/components/marathon/components/league-status/league-status.params';
import {
    IMarathonBannerCParams,
} from 'wlc-engine/modules/tournaments/components/marathon/components/marathon-banner/marathon-banner.params';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';
import {Marathon} from 'wlc-engine/modules/tournaments/system/models/marathon.model';
import {
    ITournamentPrizesRowCParams,
// eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes-row/tournament-prizes-row.params';
import {ITournamentPrize} from 'wlc-engine/modules/tournaments';

import * as Params from 'wlc-engine/modules/tournaments/components/marathon/marathon.params';

@Component({
    selector: '[wlc-marathon]',
    templateUrl: './marathon.component.html',
    styleUrls: ['./styles/marathon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarathonComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMarathonCParams;

    public override $params: Params.IMarathonCParams;
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public marathon$: BehaviorSubject<Marathon | null> = new BehaviorSubject(null);
    public gamesGridConfig: IWrapperCParams;
    public tableParams: ITableCParams;
    public noContentParams: INoContentCParams;
    public marathonBannerParams: IMarathonBannerCParams;

    protected modalService: ModalService = inject(ModalService);
    protected tournamentsService: TournamentsService = inject(TournamentsService);
    protected eventService: EventService = inject(EventService);
    protected leagues$: BehaviorSubject<League[]> = new BehaviorSubject([]);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMarathonCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.noContentParams = GlobalHelper.getNoContentParams(
            this.$params,
            this.$class,
            this.configService,
            false,
            false,
        );

        this.initSubscribers();
        this.tableParams = this.getTableParams();
        this.gamesGridConfig = this.getGamesGridConfig();
    }

    public joinLeague(league: League): void {
        const isAuth: boolean = this.configService.get<BehaviorSubject<boolean>>('$user.isAuth$').getValue();

        if (!isAuth) {
            this.modalService.showModal('signup');
            return;
        }

        this.modalService.showModal({
            ...this.$params.joinLeagueConfirmationModal,
            onConfirm: (): void => {
                this.tournamentsService.joinTournament<League>(league).finally();
            },
        });
    }

    public get leaderboardSectionName(): string | undefined {
        return this.$params.sectionNames?.leaderboard;
    }

    public get gamesSectionName(): string | undefined {
        return this.$params.sectionNames?.games;
    }

    public get rulesSectionName(): string | undefined {
        return this.$params.sectionNames?.rules;
    }

    public get tournamentPrizesRowParams(): ITournamentPrizesRowCParams {
        return this.$params.tournamentPrizesRowParams;
    }

    public get noLeaguesTitle(): string {
        return this.$params.noLeaguesTitle;
    }

    public get noLeaguesDescription(): string {
        return this.$params.noLeaguesDescription;
    }

    public get marathonTitle(): string {
        return this.$params.marathonTitle;
    }

    public get noLeaguesImagePath(): string {
        return this.$params.noLeaguesImagePath;
    }

    public get noLeaguesImageFallbackPath(): string {
        return this.$params.noLeaguesImageFallbackPath;
    }

    public get marathonTerms(): string {
        return this.marathon$.value.termsSafeHTML;
    }

    public get marathonPrizePool(): ITournamentPrize[] {
        return this.marathon$.value.prizePool;
    }

    protected initSubscribers(): void {
        this.tournamentsService.getSubscribe<Marathon>({
            useQuery: true,
            observer: {
                next: (marathons: Marathon[] | null): void => {
                    const marathon: Marathon =  marathons?.[0];

                    if (marathon) {
                        this.marathonBannerParams = this.getMarathonBannerParams(marathon);
                        this.marathon$.next(marathon);
                        this.leagues$.next(this.$params.sortLeagues?.(marathon.leagues) ?? marathon.leagues);
                    } else {
                        this.marathon$.next(null);
                        this.leagues$.next([]);
                    }

                    if (!this.ready$.value) {
                        this.ready$.next(true);
                    }
                },
            },
            tournamentType: 'marathon',
            pipes: pipe(skip(1)),
            until: this.$destroy,
        });

        if (this.$params.updateIntervalMs) {
            interval(this.$params.updateIntervalMs)
                .pipe(takeUntil(this.$destroy))
                .subscribe((): void => {
                    this.updateMarathon();
                });
        }

        this.eventService.subscribe(
            {name: 'TOURNAMENTS_FETCH_FAILED'},
            () => {
                this.ready$.next(true);
            },
            this.$destroy,
        );
    }

    protected getMarathonBannerParams(marathon: Marathon): IMarathonBannerCParams {
        return {
            ...(this.$params.marathonBannerParams || {}),
            marathon: marathon,
            updateMarathonFn: this.updateMarathon.bind(this),
        };
    }

    protected getGamesGridConfig(): IWrapperCParams {
        return {
            components: [
                {
                    name: 'games.wlc-games-grid',
                    params: this.$params.gamesGridParams,
                },
            ],
        };
    }

    protected getTableParams(): ITableCParams {
        const head: ITableCol[] = Params.marathonLeaderboardTableHeadConfig.map(
            (col: ITableCol) => {
                if (col.key === 'leagueStatus') {
                    col.mapValue = (league: League): ILeagueStatusCParams => ({
                        league,
                        joinCallback: this.joinLeague.bind(this, league),
                    });
                }

                if (col.key === 'leagueInfo') {
                    col.mapValue = (league: League): ILeagueInfoCParams => ({
                        league,
                        joinCallback: this.joinLeague.bind(this, league),
                    });
                }

                return col;
            },
        );

        return {
            ...this.$params.tableParams,
            head: head,
            rows: this.leagues$,
        };
    }

    protected updateMarathon(): void {
        this.tournamentsService.updateTournaments();
    }
}

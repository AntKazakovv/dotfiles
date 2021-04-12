import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import {UIRouterGlobals} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ITableCParams,
} from 'wlc-engine/modules/core';

import {
    TournamentsService,
    Tournament,
} from 'wlc-engine/modules/tournaments';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';

import * as MenuParams from 'wlc-engine/modules/menu/components';
import * as Params from './tournament-detail.params';

import {
    each as _each,
    set as _set,
} from 'lodash-es';

@Component({
    selector: '[wlc-tournament-detail]',
    templateUrl: './tournament-detail.component.html',
    styleUrls: ['./styles/tournament-detail.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TournamentDetailComponent
    extends AbstractComponent
    implements OnInit, OnDestroy, OnChanges {
    @Input() protected inlineParams: Params.ITournamentDetailCParams;
    @Input() protected tournamentId: number;
    @Input() protected parentInstance: TournamentComponent;


    public $params: Params.ITournamentDetailCParams;
    public isReady: boolean = false;
    public tournamentProcessing: boolean = false;
    public tournament: Tournament = null;
    public tablePrizeboard: ITableCParams = {};
    public menuParams: MenuParams.IMenuCParams = {};
    public gamesGridConfig = Params.gamesGridConfig;

    constructor(
        @Inject('injectParams')
        protected params: Params.ITournamentDetailCParams,
        protected configService: ConfigService,
        protected tournamentsService: TournamentsService,
        protected uiRouter: UIRouterGlobals,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ITournamentDetailCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.common?.tournamentId) {
            this.tournamentId = this.$params.common.tournamentId;
        }

        this.getTournament();
    }

    public joinTournament(): void {
        this.tournamentProcessing = true;
        this.$params.parentInstance.join();
        this.prepareMenu();
        this.tournamentProcessing = false;
    }

    public leaveTournament(): void {
        this.tournamentProcessing = true;
        this.$params.parentInstance.leave();
        this.prepareMenu();
        this.tournamentProcessing = false;
    }

    protected getTournament(): void {
        // -- attribute [tournamentID]
        if (this.tournamentId) {
            this.getTournamentById(this.tournamentId);
            return;
        }

        // -- tournament detail state
        if (this.uiRouter.params.tournamentId) {
            this.getTournamentById(this.uiRouter.params.tournamentId);
            return;
        }

        // -- tournament active state
        this.tournamentsService.getSubscribe({
            useQuery: !this.tournamentsService.hasTournaments,
            type: 'active',
            observer: {
                next: (tournaments: Tournament[]) => {
                    if (!tournaments) {
                        this.prepareTournament();
                        return;
                    }

                    this.tournament = tournaments.shift();
                    this.prepareTournament();
                },
            },
            until: this.$destroy,
        });
    }

    protected async getTournamentById(tournamentId: number): Promise<void> {
        if (this.tournament) {
            return;
        }

        this.tournament = await this.tournamentsService.getTournament(tournamentId) as Tournament;

        this.prepareTournament();
    }

    private prepareTournament(): void {
        if (this.tournament) {
            this.preparePrizeboard();
            this.prepareMenu();
            _set(this.gamesGridConfig, 'components[0].params.tournamentGamesFilter', this.tournament.gamesFilterData);
        }
        this.isReady = true;
        this.cdr.markForCheck();
    }

    private preparePrizeboard(): void {
        const rows = [];
        this.tablePrizeboard = this.$params.common.tablePrizeboard;

        _each(this.tournament.winningSpreadByPercent, (percent, index) => {
            rows.push({
                Place: index + 1,
                Prize: this.tournament.winningSpread[index],
                Percent: percent,
            });
        });

        this.tablePrizeboard.rows = rows;
    }

    private prepareMenu(): void {
        this.menuParams = {
            common: {
                useSwiper: true,
                swiper: {
                    scrollToStart: true,
                },
                scrollToSelector: this.$params.common.scrollToSelector,
            },
            type: 'main-menu',
            items: [
                {
                    name: this.$params.common.prizepoolSectionTitle,
                    type: 'scroll',
                    params: {
                        scroll: '.wlc-tournament-detail__prizepool',
                    },
                },
                {
                    name: this.$params.common.gamesSectionTitle,
                    type: 'scroll',
                    params: {
                        scroll: '.wlc-tournament-detail__games',
                    },
                },
            ],
        };

        if (this.tournament.selected) {
            this.menuParams.items.unshift({
                name: this.$params.common.leaderboardSectionTitle,
                type: 'scroll',
                params: {
                    scroll: '.wlc-tournament-detail__leaderboard',
                },
            });
        }

        if (this.tournament.terms) {
            this.menuParams.items.push({
                name: this.$params.common.rulesSectionTitle,
                type: 'scroll',
                params: {
                    scroll: '.wlc-tournament-detail__rules',
                },
            });
        }
    }
}

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    AfterViewInit,
    ViewEncapsulation,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {takeUntil} from 'rxjs/operators';

import _each from 'lodash-es/each';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    ITableCParams,
    IIndexing,
    GlobalHelper,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';
import {MenuParams} from 'wlc-engine/modules/menu';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

import * as Params from './tournament-detail.params';

@Component({
    selector: '[wlc-tournament-detail]',
    templateUrl: './tournament-detail.component.html',
    styleUrls: ['./styles/tournament-detail.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class TournamentDetailComponent extends AbstractComponent implements
    OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() public tournament: Tournament;
    @Input() public inlineParams: Params.ITournamentDetailCParams;
    @Input() public parentInstance: TournamentComponent;

    public $params: Params.ITournamentDetailCParams;
    public isReady: boolean = false;
    public tournamentProcessing: boolean = false;
    public isTournamentSelected: boolean = false;
    public tablePrizeboard: ITableCParams = {};
    public menuParams: MenuParams.IMenuCParams;
    public gamesGridConfig = Params.gamesGridConfig;
    public menuConfig: IWrapperCParams = {components: []};
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.ITournamentDetailCParams,
        protected configService: ConfigService,
        protected tournamentsService: TournamentsService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
        protected router: UIRouter,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ITournamentDetailCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod']));
    }

    public async ngAfterViewInit(): Promise<void> {
        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');

        await this.gamesCatalogService.ready;

        if (this.parentInstance) {
            this.$params.parentInstance = this.parentInstance;
        }

        this.$params.parentInstance.pending$
            .pipe(takeUntil(this.$destroy))
            .subscribe((pending) => {
                this.tournamentProcessing = pending;
                this.isTournamentSelected = this.$params.parentInstance.isTournamentSelected;
                this.tournament = this.$params.common.tournament;
                this.prepareTournament();
                this.cdr.markForCheck();
            });
    }

    public goTo(path: string, params: IIndexing<string> = {}): void {
        this.router.stateService.go(path, params);
    }

    public joinTournament(): void {
        this.$params.parentInstance.join();
    }

    public leaveTournament(): void {
        this.$params.parentInstance.leave();
    }

    /**
     * Update tournament list
     */
    public updateTournaments(): void {
        if (this.tournament.isTournamentEnds) {
            if (this.modalService.getActiveModal('tournament-detail-modal')) {
                this.modalService.hideModal('tournament-detail-modal');
            } else {
                this.tournamentsService.updateTournaments();
                this.router.stateService.go('app.profile.loyalty-tournaments.main');
            }
        }
    }

    private prepareTournament(): void {

        if (this.tournament) {
            this.preparePrizeboard();
            _set(this.gamesGridConfig, 'components[0].params.tournamentGamesFilter', this.tournament.gamesFilterData);
            _set(this.gamesGridConfig, 'components[0].params.tournamentFreeRoundGames', this.tournament.freeRoundGames);
            this.prepareMenu();
        }
        this.isReady = true;
        this.cdr.markForCheck();
    }

    private preparePrizeboard(): void {
        const rows: Params.ITournamentPrizeRows[] = [];
        this.tablePrizeboard = this.$params.common.tablePrizeboard;

        _each(this.tournament.winningSpread, (value: number, index: number): void => {
            rows.push({
                Place: index + 1,
                Prize: {
                    value: this.tournament.winningSpread[index],
                    currency: this.tournament.targetDefaultCurrency,
                },
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
            scrollDuration: 500,
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

        this.loadMenuComponent();
    }

    private loadMenuComponent(): void {
        this.menuConfig = {
            components: [
                {
                    name: 'menu.wlc-menu',
                    params: this.menuParams,
                },
            ],
        };
    }
}

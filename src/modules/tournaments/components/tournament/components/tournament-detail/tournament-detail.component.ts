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
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
    IIndexing,
    GlobalHelper,
    IWrapperCParams,
    InjectionService,
} from 'wlc-engine/modules/core';
import {MenuParams} from 'wlc-engine/modules/menu';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';


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

    public override $params: Params.ITournamentDetailCParams;
    public isReady: boolean = false;
    public tournamentProcessing: boolean = false;
    public isTournamentSelected: boolean = false;
    public menuParams: MenuParams.IMenuCParams;
    public gamesGridConfig = Params.gamesGridConfig;
    public menuConfig: IWrapperCParams = {components: []};
    public usePodium: boolean;
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams')
        protected injectParams: Params.ITournamentDetailCParams,
        configService: ConfigService,
        protected tournamentsService: TournamentsService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
        protected router: UIRouter,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ITournamentDetailCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override ngOnInit(): void {
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

    /**
     * Returns text description for timer
     * */
    public getTimerText(): string {
        return this.$params.common.tournament?.isTournamentStarts
            ? this.$params.common?.timerTextAfterStart
            : this.$params.common?.timerTextBeforeStart;
    }

    private prepareTournament(): void {

        if (this.tournament) {
            _set(this.gamesGridConfig, 'components[0].params.tournamentGamesFilter', this.tournament.gamesFilterData);
            _set(this.gamesGridConfig, 'components[0].params.tournamentFreeRoundGames', this.tournament.freeRoundGames);

            this.usePodium = this.configService.get<boolean>('$tournaments.prizePodium.useOnDetail')
                && this.tournament.target !== 'bonus';

            this.prepareMenu();
        }
        this.isReady = true;
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

        this.initMenuComponent();
    }

    private initMenuComponent(): void {
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

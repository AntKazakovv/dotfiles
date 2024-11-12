import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    AfterViewInit,
    ViewEncapsulation,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {takeUntil} from 'rxjs/operators';
import _set from 'lodash-es/set';
import _join from 'lodash-es/join';

import {
    AbstractComponent,
    IMixedParams,
    ModalService,
    IIndexing,
    GlobalHelper,
    IWrapperCParams,
    InjectionService,
    ActionService,
} from 'wlc-engine/modules/core';
import {MenuParams} from 'wlc-engine/modules/menu';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {TournamentComponent} from 'wlc-engine/modules/tournaments/components/tournament/tournament.component';
import {ITournamentTags} from 'wlc-engine/modules/tournaments';
import {
    ITagCParams,
    ITagCommon,
} from 'wlc-engine/modules/core/components/tag/tag.params';
import {ITournamenFreeSpinsParams} from '../tournament-free-spins/tournament-free-spins.params';

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
    OnInit, AfterViewInit {
    @Input() public inlineParams: Params.ITournamentDetailCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public parentInstance: TournamentComponent;

    public override $params: Params.ITournamentDetailCParams;
    public isReady: boolean = false;
    public tournament: Tournament;
    public pending: boolean = false;
    public tournamentIsOver: boolean = false;
    public menuParams: MenuParams.IMenuCParams;
    public gamesGrid: IWrapperCParams;
    public menuConfig: IWrapperCParams = {components: []};
    public usePodium: boolean;
    public availableLevels: string;
    public tagClass: string;
    public tagConfig: ITagCParams;
    public freeSpinsParams: ITournamenFreeSpinsParams;
    public lockBtnText: string;

    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentDetailCParams,
        protected tournamentsService: TournamentsService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
        protected router: UIRouter,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ITournamentDetailCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
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
                this.pending = pending;
                this.tournament = this.$params.parentInstance.tournament;
                this.freeSpinsParams = {
                    theme: this.$params.theme,
                    freeSpins: this.tournament.freeRounds,
                    tournamentId: this.tournament.id,
                    buyParams: {
                        ltid: this.tournament.LTID,
                        merchant: this.tournament.merchant,
                    },
                };
                this.prepareTournament();
                this.cdr.markForCheck();
            });

        if (this.tournament.onlyForLevels) {
            this.availableLevels = _join([...this.tournament.onlyForLevels].reverse(), ', ');
            this.lockBtnText = this.configService.get('$tournaments.lockBtnText');
        }

        this.gamesGrid = {
            components: [
                {
                    name: 'games.wlc-games-grid',
                    params: this.$params.gamesGridConfig,
                },
            ],
        };

        if (this.$params.theme === 'wolf') {
            this.$params.prizesParams.theme = 'wolf';
            _set(this.gamesGrid, 'components[0].params.btnLoadMore.theme', 'theme-wolf-link');
            this.setTagConfig();
        } else {
            this.tagClass = this.tournament.tag.toLowerCase();
        }
        const selectorParam = this.router.stateService.params['#'];
        if (selectorParam) {
            this.scrollTo(`#${selectorParam}`);
        }
        if (this.$params.common.scrollToSelector) {
            this.scrollTo(this.$params.common.scrollToSelector);
        }
    }

    public scrollTo(selector: string, delay = 500): void {
        setTimeout(() => {
            this.actionService.scrollTo(selector, {useScrollingOffset: false});
        }, delay);
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
        if (!this.tournamentIsOver) {
            this.tournamentIsOver = true;

            if (this.$params.theme === 'wolf') {
                this.setTagConfig();
            } else {
                this.tagClass = this.tournament.tag.toLowerCase();
            }

            this.cdr.markForCheck();
        }
    }

    protected setTagConfig(): void {
        if (this.tournament.tag) {
            const moduleTagsConfig: ITournamentTags = this.configService.get('$tournaments.tagsConfig');
            const tagCommon: ITagCommon = moduleTagsConfig.tagList[this.tournament.tag];

            if (tagCommon) {

                if (!moduleTagsConfig.useIcons) {
                    tagCommon.iconUrl = null;
                }

                this.tagConfig = {
                    common: tagCommon,
                };
            }
        }
    }

    private prepareTournament(): void {

        if (this.tournament) {
            _set(this.$params.gamesGridConfig, 'tournamentGamesFilter', this.tournament.gamesFilterData);
            _set(this.$params.gamesGridConfig, 'tournamentFreeRoundGames', this.tournament.freeRoundGames);

            this.usePodium = this.configService.get<boolean>('$tournaments.prizePodium.useOnDetail')
                && this.tournament.target !== 'bonus';

            this.prepareMenu();
        }
        this.isReady = true;
    }

    /**
     * @deprecated anchors menu will be deleted
     * */
    private prepareMenu(): void {
        this.menuParams = {
            common: {
                useSwiper: true,
                swiper: {
                    scrollToStart: true,
                },
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

        if (this.tournament.onlyForLevels) {
            this.menuParams.items.unshift({
                name: this.$params.common.levelsTitle,
                type: 'scroll',
                params: {
                    scroll: '.wlc-tournament-detail__levels',
                },
            });
        }

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

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
    AfterViewInit,
} from '@angular/core';

import {UIRouterGlobals} from '@uirouter/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    IPaginateOutput,
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {
    Tournament,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';
import {TournamentComponent} from '../tournament/tournament.component';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';

import * as Params from 'wlc-engine/modules/tournaments/components/tournament-list/tournament-list.params';

import _union from 'lodash-es/union';
import _merge from 'lodash-es/merge';
import _each from 'lodash-es/each';
import _filter from 'lodash-es/filter';

@Component({
    selector: '[wlc-tournament-list]',
    templateUrl: './tournament-list.component.html',
    styleUrls: ['./styles/tournament-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentListComponent
    extends AbstractComponent
    implements OnInit, AfterViewInit {

    @Input() protected type: Params.ComponentType;
    @Input() protected theme: Params.ComponentTheme;
    @Input() protected themeMod: Params.ThemeMod;
    @Input() protected customMod: Params.CustomMod;
    @Input() protected inlineParams: Params.ITournamentListCParams;
    @ViewChild(SliderComponent) public slider: SliderComponent;

    public $params: Params.ITournamentListCParams;
    public isTournamentSelected: boolean;
    public activeTournament: Tournament;
    public tournaments: Tournament[] = [];
    public paginatedTournaments: Tournament[] = [];
    public isReady: boolean = false;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];
    public isAuth: boolean;
    public noContentParams: INoContentCParams;

    protected indexOfSelectedTournament: number;
    protected itemsPerPage: number = 0;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentListCParams,
        protected tournamentsService: TournamentsService,
        protected eventService: EventService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
    ) {
        super(
            <IMixedParams<Params.ITournamentListCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.isReady = false;
        if (this.$params.type === 'swiper') {
            this.sliderParams.swiper = this.$params.common?.swiper;
        }
        this.subscribeOnTournamentLeave();
        this.subscribeOnErrorGettingTournaments();
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService);
        this.cdr.detectChanges();
    }

    public ngAfterViewInit(): void {
        this.getTournaments();
    }

    public get readyTournamentsAndSlides(): boolean {
        return !!(this.tournaments?.length && this.isReady && this.slides?.length);
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput): void {
        this.paginatedTournaments = value.paginatedItems as Tournament[];
        this.itemsPerPage = value.event.itemsPerPage;
        this.cdr.markForCheck();
    }

    protected subscribeOnTournamentLeave(): void {
        this.eventService.subscribe(
            {name: 'TOURNAMENT_LEAVE_SUCCEEDED'},
            () => {
                this.saveDataOfSelectedTournament(this.tournaments);
                this.cdr.markForCheck();
            },
            this.$destroy,
        );
    }

    protected subscribeOnErrorGettingTournaments(): void {
        this.eventService.subscribe(
            {name: 'TOURNAMENTS_FETCH_FAILED'},
            () => {
                this.paginatedTournaments = this.tournaments = [];
                this.isReady = true;
                this.cdr.markForCheck();
            },
            this.$destroy,
        );
    }

    protected getTournaments(): void {
        this.tournamentsService.getSubscribe({
            // TODO Fix it. This is not working correctly.
            // useQuery: !this.tournamentsService.hasTournaments,
            useQuery: this.tournamentsService.updateData,
            observer: {
                next: (tournaments: Tournament[]) => {
                    if (!tournaments) return;

                    this.indexOfSelectedTournament = null;

                    this.saveDataOfSelectedTournament(tournaments);
                    this.replaceTournaments(tournaments);

                    if (this.uiRouter.params.tournamentId) {
                        tournaments = _filter(
                            tournaments, tournament => tournament.id === +this.uiRouter.params.tournamentId,
                        );
                    }

                    this.paginatedTournaments = this.tournaments = tournaments;

                    if (this.$params.type === 'swiper' && this.tournaments.length) {
                        this.tournamentsToSlides(true);
                    }

                    this.isReady = true;
                    this.cdr.markForCheck();
                },
            },
            type: this.$params.common?.restType,
            until: this.$destroy,
        });
    }

    protected replaceTournaments(tournaments: Tournament[]): void {
        if (this.indexOfSelectedTournament < 0) return;

        tournaments.unshift(...tournaments.splice(this.indexOfSelectedTournament, 1));
    }

    protected saveDataOfSelectedTournament(tournaments: Tournament[]): void {
        let tournamentSelected = false;
        _each(tournaments, (tournament, index) => {
            if (tournament.isSelected) {
                tournamentSelected = true;
                this.isTournamentSelected = true;
                this.activeTournament = tournament;
                this.indexOfSelectedTournament = index;

                return false;
            }
        });

        if (!tournamentSelected) {
            this.isTournamentSelected = false;
            this.activeTournament = null;
            this.indexOfSelectedTournament = -1;
        }
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customMod) {
            modifiers = _union(modifiers, this.$params.common.customMod.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected tournamentsToSlides(scroll?: boolean): void {
        this.slides = this.tournaments?.map((tournament: Tournament) => {
            return {
                component: TournamentComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    {type: this.$params.common?.thumbType},
                    {tournament},
                    {wlcElement: 'block_tournament'},
                ),
            };
        });

        if (this.slider?.swiper && scroll) {
            this.slider.swiper.swiperRef.slideTo(0);
        }
        this.cdr.markForCheck();
    }

    protected prepareParams(): Params.ITournamentListCParams {
        if (this.inlineParams) {
            return this.inlineParams;
        }
    }
}

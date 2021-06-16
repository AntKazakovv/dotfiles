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
    public isReady: boolean = false;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];
    public isAuth: boolean;

    protected indexOfSelectedTournament: number;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentListCParams,
        protected tournamentsService: TournamentsService,
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
    }

    public ngAfterViewInit(): void {
        this.getTournaments();
    }

    public get readyTournamentsAndSlides(): boolean {
        return !!(this.tournaments?.length && this.isReady && this.slides?.length);
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
                        tournaments = _filter(tournaments, tournament => tournament.id === +this.uiRouter.params.tournamentId);
                    }

                    this.tournaments = tournaments;

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
        _each(tournaments, (tournament, index) => {
            if (tournament.isSelected) {
                this.isTournamentSelected = true;
                this.activeTournament = tournament;
                this.indexOfSelectedTournament = index;

                return false;
            }
        });
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

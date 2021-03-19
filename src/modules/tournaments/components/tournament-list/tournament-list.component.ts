import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    Input,
    ViewChild,
} from '@angular/core';
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

import {
    union as _union,
    merge as _merge,
    filter as _filter,
    find as _find,
    some as _some,
} from 'lodash-es';

@Component({
    selector: '[wlc-tournament-list]',
    templateUrl: './tournament-list.component.html',
    styleUrls: ['./styles/tournament-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentListComponent
    extends AbstractComponent
    implements OnInit {

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

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentListCParams,
        protected tournamentsService: TournamentsService,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
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
        this.getTournaments();
    }

    protected getTournaments(): void {
        this.tournamentsService.getSubscribe({
            useQuery: !this.tournamentsService.hasTournaments,
            observer: {
                next: (tournaments: Tournament[]) => {
                    if (!tournaments) return;

                    this.tournaments = tournaments;
                    this.isTournamentSelected = _some(tournaments, tournament => tournament.isSelected);
                    this.activeTournament = _find(tournaments, tournament => tournament.isSelected);
                    if (this.$params.type === 'swiper' && this.tournaments.length) {
                        this.tournamentsToSlides();
                    }
                    this.isReady = true;
                    this.cdr.markForCheck();
                },
            },
            type: this.$params.common?.restType,
            until: this.$destroy,
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
        this.slides = this.tournaments?.map((item: Tournament) => {
            return {
                component: TournamentComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    {type: this.$params.common?.thumbType},
                    {tournament: item},
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

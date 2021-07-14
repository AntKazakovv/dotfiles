import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import {SwiperOptions} from 'swiper';
import SwiperCore from 'swiper/core';
import {takeUntil} from 'rxjs/operators';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    SliderHelper,
    ISliderCssProps,
} from 'wlc-engine/modules/promo/system/helpers/slider.helper';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {WinnersService} from 'wlc-engine/modules/promo/system/services/winners/winners.service';
import {WinnerModel} from 'wlc-engine/modules/promo/system/models/winner.model';
import {WinnerComponent} from 'wlc-engine/modules/promo/components/winner/winner.component';

import * as Params from './winners-slider.params';

import _merge from 'lodash-es/merge';
import _clone from 'lodash-es/clone';
import _forEach from 'lodash-es/forEach';
import _assign from 'lodash-es/assign';

@Component({
    selector: '[wlc-winners-slider]',
    templateUrl: './winners-slider.component.html',
    styleUrls: ['./styles/winners-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersSliderComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @Input() protected inlineParams: Params.IWinnersSliderCParams;
    @ViewChild('winner') winner: TemplateRef<WinnerModel>;

    public $params: Params.IWinnersSliderCParams;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];
    public ready: boolean = false;

    protected useCssProps: boolean = false;
    protected cssProps: ISliderCssProps = {
        slidesPerView: '--wlc-winner-slider-slides-per-view',
        spaceBetween: '--wlc-winner-slider-slide-gap',
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWinnersSliderCParams,
        protected configService: ConfigService,
        protected winnersService: WinnersService,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        private element: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareSliderParams();

        if (!this.$params.title) {
            this.addModifiers('headless');
        }

        this.initSubscribers();
    }

    public ngAfterViewInit(): void {
        this.initBreakpoints();
    }

    public onSliderResize(swiper: SwiperCore): void {
        if (this.useCssProps) {
            this.setCssProperties(swiper.params);
        }
    }

    protected setCssProperties(swiperProps: SwiperOptions): void {
        SliderHelper.setPropsByBreakpoints(
            swiperProps,
            this.cssProps,
            this.element.nativeElement,
            this.renderer,
        );
    }

    protected initBreakpoints(): void {
        if (this.sliderParams.swiper.direction === 'vertical') {
            this.useCssProps = true;
            const activeBreakpoint = SliderHelper.getActiveBreakpoint(this.sliderParams.swiper);
            this.setCssProperties({
                ...this.sliderParams.swiper,
                ...this.sliderParams.swiper.breakpoints?.[activeBreakpoint],
            });
        }
    }

    protected initSubscribers(): void {

        if (this.$params.type === 'biggest') {
            this.winnersService.biggestWinsObserver
                .pipe(takeUntil(this.$destroy))
                .subscribe((winners: WinnerModel[]) => {
                    this.responseToSlides(winners);
                });
        } else {
            this.winnersService.latestWinsObserver
                .pipe(takeUntil(this.$destroy))
                .subscribe((winners: WinnerModel[]) => {
                    this.responseToSlides(winners);
                });
        }
    }

    protected responseToSlides(response: WinnerModel[]): void {

        this.slides = response.map((item: WinnerModel) => {
            return {
                component: WinnerComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    this.$params.winner,
                    {winner: item},
                    {
                        winnerType: this.$params.type,
                        wlcElement: 'block_item-' + this.$params.type + '-wins',
                    },
                ),
            };
        });

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    protected prepareSliderParams(): void {

        let swiper: SwiperOptions = _clone(Params.swiperParamsDefault[this.$params.theme])
                                        || _clone(Params.swiperParamsDefault.default);

        if (this.$params.swiper) {
            swiper = _assign({}, swiper, this.$params.swiper);
        }

        if (swiper.spaceBetween) {
            (this.element.nativeElement as HTMLElement).style.setProperty(
                '--wlc-winner-slider-slide-gap',
                swiper.spaceBetween + 'px',
            );
        }

        this.sliderParams.swiper = swiper;
        this.sliderParams.wlcElement = 'list_' + this.$params.type + '-wins';
        this.cdr.markForCheck();
    }
}

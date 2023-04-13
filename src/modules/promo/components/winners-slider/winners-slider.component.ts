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
import {
    takeUntil,
    debounceTime,
} from 'rxjs/operators';
import {SwiperOptions} from 'swiper';
import SwiperCore from 'swiper';

import _merge from 'lodash-es/merge';
import _clone from 'lodash-es/clone';
import _assign from 'lodash-es/assign';

import {
    ConfigService,
    AbstractComponent,
    GlobalHelper,
    ActionService,
} from 'wlc-engine/modules/core';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
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
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './winners-slider.params';

@Component({
    selector: '[wlc-winners-slider]',
    templateUrl: './winners-slider.component.html',
    styleUrls: ['./styles/winners-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnersSliderComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @Input() protected inlineParams: Params.IWinnersSliderCParams;
    @ViewChild('winner') winner: TemplateRef<WinnerModel>;

    public override $params: Params.IWinnersSliderCParams;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public slides: ISlide[] = [];
    public ready: boolean = false;
    public noContentParams: INoContentCParams;

    protected useCssProps: boolean = false;
    protected cssProps: ISliderCssProps = {
        slidesPerView: '--wlc-winner-slider-slides-per-view',
        spaceBetween: '--wlc-winner-slider-slide-gap',
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWinnersSliderCParams,
        configService: ConfigService,
        protected winnersService: WinnersService,
        cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected actionService: ActionService,
        @Inject(WINDOW) protected window: Window,
        private element: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.prepareSliderParams();

        if (!this.$params.title) {
            this.addModifiers('headless');
        }
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService, true);
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

    public get isTitleVisible(): boolean {
        return this.$params.title && !!(this.$params.theme !== 'default' || this.slides.length);
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
            const activeBreakpoint = SliderHelper.getActiveBreakpoint(this.sliderParams.swiper, this.window);
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

        // TODO это костыль, решение ищется в тикете https://tracker.egamings.com/issues/344548
        this.actionService.windowResize()
            .pipe(
                debounceTime(500),
                takeUntil(this.$destroy),
            )
            .subscribe(() => {
                this.initBreakpoints();
            });
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

        this.cdr.detectChanges();
    }

    protected prepareSliderParams(): void {

        let swiper: SwiperOptions = _clone(Params.swiperParamsDefault[this.$params.theme])
                                        || _clone(Params.swiperParamsDefault.default);

        if (this.$params.theme === 'default' && this.$params.title) {
            _merge(swiper, Params.swiperParamsDefault.defaultWithTitleAddition);
        }

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

        if (GlobalHelper.isMobileApp()) {
            this.sliderParams.useStartTimeout = true;
        }
        this.cdr.markForCheck();
    }
}

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import Swiper from 'swiper';
import {SwiperOptions} from 'swiper/types/swiper-options';
import _assign from 'lodash-es/assign';
import _clone from 'lodash-es/clone';
import _map from 'lodash-es/map';

import {
    GlobalHelper,
    AbstractComponent,
    InjectionService,
    ISlide,
    SliderHelper,
    ISliderCssProps,
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {JackpotModel} from 'wlc-engine/modules/games';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {JackpotComponent} from 'wlc-engine/modules/promo/components/jackpot/jackpot.component';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './jackpots-slider.params';

@Component({
    selector: '[wlc-jackpots-slider]',
    templateUrl: './jackpots-slider.component.html',
    styleUrls: ['./styles/jackpots-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotsSliderComponent extends AbstractComponent implements OnInit, AfterViewInit {

    @Input() protected inlineParams: Params.IJackpotsSliderCParams;
    public slides: ISlide[] = [];
    public ready: boolean = false;
    public override $params: Params.IJackpotsSliderCParams;
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public noContentParams: INoContentCParams;

    protected useCssProps: boolean = false;
    protected cssProps: ISliderCssProps = {
        slidesPerView: '--wlc-jackpot-slider-slides-per-view',
        spaceBetween: '--wlc-jackpot-slider-slide-gap',
    };
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotsSliderCParams,
        protected injectionService: InjectionService,
        protected renderer: Renderer2,
        @Inject(WINDOW) protected window: Window,
        private element: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.prepareSliderParams();
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService);
        this.initListener();
        this.ready = true;
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.initBreakpoints();
    }

    public onSliderResize(swiper: Swiper): void {
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
            const activeBreakpoint = SliderHelper.getActiveBreakpoint(this.sliderParams.swiper, this.window);
            this.setCssProperties({
                ...this.sliderParams.swiper,
                ...this.sliderParams.swiper.breakpoints?.[activeBreakpoint],
            });
        }
    }

    protected initListener(): void {
        this.gamesCatalogService.subscribeJackpots
            .pipe(takeUntil(this.$destroy))
            .subscribe((jackpots: JackpotModel[]) => {
                this.responseToSlides(jackpots);
            });
    }

    protected responseToSlides(response: JackpotModel[]): void {
        this.slides = _map(response, item => ({
            component: JackpotComponent,
            componentParams: {
                theme: this.$params.theme,
                data: item,
            },
        }));

        if (!this.ready) {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    protected prepareSliderParams(): void {
        let swiper: SwiperOptions = _clone(Params.swiperParamsDefault[this.$params.theme]);

        if (this.$params.sliderParams) {
            swiper = _assign({}, swiper, this.$params.sliderParams);
        }

        if (swiper.spaceBetween) {
            this.renderer.setStyle(
                this.element.nativeElement,
                '--wlc-jackpot-slider-slide-gap',
                swiper.spaceBetween + 'px',
            );
        }

        this.sliderParams.swiper = swiper;

        if (GlobalHelper.isMobileApp()) {
            this.sliderParams.useStartTimeout = true;
        }

        this.cdr.markForCheck();
    }
}

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import SwiperCore, {SwiperOptions} from 'swiper';
import _map from 'lodash-es/map';

import {
    GlobalHelper,
    AbstractComponent,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {JackpotModel} from 'wlc-engine/modules/games';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {JackpotComponent} from 'wlc-engine/modules/promo/components/jackpot/jackpot.component';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {
    SliderHelper,
    ISliderCssProps,
} from 'wlc-engine/modules/promo/system/helpers/slider.helper';
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
    public $params: Params.IJackpotsSliderCParams;
    public noContentParams: INoContentCParams;

    protected useCssProps: boolean = false;
    protected cssProps: ISliderCssProps = {
        slidesPerView: '--wlc-jackpot-slider-slides-per-view',
        spaceBetween: '--wlc-jackpot-slider-slide-gap',
    };
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotsSliderCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected injectionService: InjectionService,
        protected renderer: Renderer2,
        @Inject(WINDOW) protected window: Window,
        private element: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService);
        this.initListener();
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
        this.useCssProps = true;
        if (this.$params.sliderParams.swiper.direction === 'vertical') {
            const activeBreakpoint = SliderHelper.getActiveBreakpoint(this.$params.sliderParams.swiper, this.window);
            this.setCssProperties({
                ...this.$params.sliderParams.swiper,
                ...this.$params.sliderParams.swiper.breakpoints?.[activeBreakpoint],
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
}

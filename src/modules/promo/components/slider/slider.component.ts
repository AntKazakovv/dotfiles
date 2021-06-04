import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import SwiperCore, {
    EffectFade,
    EffectCube,
    EffectFlip,
    Navigation,
    Pagination,
    Autoplay,
    Mousewheel,
    Scrollbar,
    Swiper,
    SwiperOptions,
} from 'swiper/core';
import {SwiperComponent} from 'swiper/angular';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService, ConfigService} from 'wlc-engine/modules/core';
import {
    BannersService,
    WinnersService,
} from 'wlc-engine/modules/promo/system/services';
import {IResizeEvent} from 'wlc-engine/modules/core/system/services/action/action.service';
import * as Params from './slider.params';


import _assign from 'lodash-es/assign';
import _ceil from 'lodash-es/ceil';
import _cloneDeep from 'lodash-es/cloneDeep';
import _floor from 'lodash-es/floor';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _includes from 'lodash-es/includes';
import _isNumber from 'lodash-es/isNumber';
import _times from 'lodash-es/times';
import _toNumber from 'lodash-es/toNumber';

SwiperCore.use([
    EffectFade,
    EffectCube,
    EffectFlip,
    Navigation,
    Pagination,
    Autoplay,
    Mousewheel,
    Scrollbar,
]);

@Component({
    selector: '[wlc-slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./styles/slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnChanges {

    @ViewChild(SwiperComponent) public swiper: SwiperComponent;

    @Input() public slides: Params.ISlide[];
    @Input() protected inlineParams: Params.ISliderCParams;

    @Output() public slideChangeTransitionEnd$ = new EventEmitter<Swiper>();

    public sliderWrap: Element;
    public $params: Params.ISliderCParams;

    public ready: boolean = false;
    public slidesSequence: number[] = [];
    public emptySlidesCount: number = 0;
    public slideMaxWidth: number = 0;

    private frozenSwiperParams: SwiperOptions;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISliderCParams,
        protected configService: ConfigService,
        protected bannersService: BannersService,
        protected winnersService: WinnersService,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected injector: Injector,
        protected actionService: ActionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.slides && !this.slides) {
            this.slides = this.$params.slides;
        }

        this.frozenSwiperParams = _cloneDeep(this.$params.swiper);

        this.initEmptySlidesCount();
        // for fix loop
        this.fixSlidesSequence();
    }

    public initEmptySlidesCount(): void {
        if (this.isAutoSlidesAndColumnMode()) {
            const {swiper} = this.$params;
            if (_isNumber(swiper?.slidesPerView) && swiper?.slidesPerColumn) {
                const groupCount: number = swiper.slidesPerView * swiper.slidesPerColumn;
                const fullFilledSlides: number = Math.floor(this.slides.length / groupCount);
                this.emptySlidesCount = groupCount - (this.slides.length - (groupCount * fullFilledSlides));
            }
        } else {
            this.emptySlidesCount = 0;
        }
    }

    public ngAfterViewInit(): void {
        this.initEventHandlers();
        setTimeout(() => {
            this.updateView();
        }, 0);

        this.ready = true;
    }

    public ngOnChanges(): void {
        if (this.ready) {
            this.fixSlidesSequence();
            this.cdr.detectChanges();
            this.update();

        }
    }

    public detectSlide(slide: Params.ISlide): string {
        if (slide) {
            if (slide.component) {
                return 'component';
            } else if (slide.templateRef) {
                return 'templateRef';
            } else if (slide.htmlString) {
                return 'htmlString';
            }
        }
        return '';
    }

    public getInjector(slide: Params.ISlide): Injector {
        if (!slide.injector) {
            slide.injector = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: _assign({}, slide.componentParams || {}),
                    },
                ],
                parent: this.injector,
            });
        }
        return slide.injector;
    }

    public onUpdate(swiper): void {
        if (this.isAutoSlidesAndColumnMode()) {
            this.setSliderWrapper();
            const slides: HTMLCollection = _get(this.sliderWrap, 'children');
            const firstSlide = (slides[0] as HTMLElement);

            _forEach(slides, (slide: HTMLElement) => {
                slide.style.maxWidth = firstSlide.style.width;
            });
            this.cdr.detectChanges();
        }
    }

    public update(): void {
        this.swiper.updateSwiper({});
    }

    public scrollToStart(): void {
        this.swiper.setIndex(0, 0, true);
    }

    public onResize(): void {
        this.updateView();
    }

    protected setSliderWrapper(): void {
        const swiperContainer: HTMLElement = _get(this.swiper, 'elementRef.nativeElement');
        if (!this.sliderWrap) {
            this.sliderWrap = swiperContainer.querySelector('.swiper-wrapper');
        }
    }

    protected isAutoSlidesAndColumnMode(): boolean {
        return !!(this.$params.swiper?.slidesPerView === 'auto' && this.$params.swiper?.slidesPerColumn);
    }

    protected updateView(): void {
        const swiperContainer: HTMLElement = _get(this.swiper, 'elementRef.nativeElement');
        if (!this.sliderWrap) {
            this.sliderWrap = swiperContainer.querySelector('.swiper-wrapper');
        }
        const slides: HTMLCollection = _get(this.sliderWrap, 'children');
        const firstSlide = (slides[0] as HTMLElement);

        if (this.$params.slidesAspectRatio) {
            const aspectCoef: string[] = this.$params.slidesAspectRatio.split('/');
            if (aspectCoef.length === 2 && slides.length) {
                const slideHeight: number = firstSlide.offsetHeight;
                const slideWidth: number = slideHeight * (_toNumber(aspectCoef[0]) / _toNumber(aspectCoef[1]));
                this.slideMaxWidth = slideWidth;

                _forEach(slides, (slide: HTMLElement) => {
                    slide.style.width = `${slideWidth}px`;
                    slide.style.maxWidth = `${slideWidth}px`;
                });
            }
        }

        if (this.isAutoSlidesAndColumnMode()) {
            this.emptySlidesCount = 0;

            this.renderer.setStyle(this.sliderWrap, 'width', 'auto');
            const swiperWidth: number = swiperContainer.offsetWidth;

            const margin = parseInt(firstSlide.style.marginRight);
            const slideWith = firstSlide.offsetWidth + margin;

            const groupCount: number = this.$params.swiper.slidesPerColumn *
                _ceil(swiperWidth / (firstSlide.offsetWidth + margin));
            const floorGroupCount: number = this.$params.swiper.slidesPerColumn *
                _floor(swiperWidth / (firstSlide.offsetWidth + margin));
            const minGroup = _ceil(slides.length / this.$params.swiper.slidesPerColumn)
                * this.$params.swiper.slidesPerColumn;
            const minGroupWidth: number = minGroup / this.$params.swiper.slidesPerColumn * slideWith;

            if (this.slides.length < floorGroupCount) {
                this.emptySlidesCount = floorGroupCount - this.slides.length;
            } else if (this.slides.length < groupCount) {
                this.emptySlidesCount = groupCount - this.slides.length;
            } else {
                this.emptySlidesCount = minGroup - this.slides.length;
            }
            this.fixSlidesSequence();
        }
        this.cdr.detectChanges();
        this.update();
    }

    protected windowResizeHandler(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe((data: IResizeEvent) => {
                this.updateView();
            });
    }

    protected fixSlidesSequence(): void {
        if (!this.slides?.length) {
            return;
        }

        const {swiper} = this.$params;
        const realSequence: number[] = _times(this.slides.length + this.emptySlidesCount, (i) => i);

        if (swiper?.loop) {
            const slides: number = _isNumber(swiper.slidesPerView) ? swiper.slidesPerView : 5;
            if (slides > this.slides.length) {
                this.slidesSequence = this.fillSequence(realSequence, slides);
                return;
            }

            this.slidesSequence = realSequence;
            return;
        }
        this.slidesSequence = realSequence;

        if (this.slidesSequence.length <= 1) {
            swiper.slidesPerView = 'auto';
        } else {
            swiper.slidesPerView = this.frozenSwiperParams.slidesPerView;
        }
    }

    protected fillSequence(realSequence: number[], slides: number) {
        let result: number[] = [];
        while (result.length < slides) {
            result = result.concat(realSequence);
        }
        return result;
    }

    protected initEventHandlers(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe((data: IResizeEvent) => {
                this.updateView();
            });

        this.swiper.s_progress.subscribe((swiper) => {
            this.removeModifiers('on-start');
            this.removeModifiers('on-end');
            this.removeModifiers('on-progress');

            if (swiper.isBeginning) {
                this.addModifiers('on-start');
            } else if (swiper.isEnd) {
                this.addModifiers('on-end');
            } else {
                this.addModifiers('on-progress');
            }
        });

        this.swiper.s_slideChangeTransitionEnd.pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.slideChangeTransitionEnd$.emit(this.swiper.swiperRef);
            });
    }
}

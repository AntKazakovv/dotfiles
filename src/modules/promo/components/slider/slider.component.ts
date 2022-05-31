import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import SwiperCore, {
    EffectCoverflow,
    EffectFade,
    EffectCube,
    EffectFlip,
    Navigation,
    Pagination,
    Autoplay,
    Mousewheel,
    Scrollbar,
    Swiper,
    Grid,
    SwiperOptions,
} from 'swiper';
import {SwiperComponent} from 'swiper/angular';
import {NavigationOptions} from 'swiper/types';

import {
    AbstractComponent,
    ConfigService,
    ActionService,
} from 'wlc-engine/modules/core';
import {WinnersService} from 'wlc-engine/modules/promo/system/services/winners/winners.service';

import * as Params from './slider.params';


import _assign from 'lodash-es/assign';
import _ceil from 'lodash-es/ceil';
import _cloneDeep from 'lodash-es/cloneDeep';
import _floor from 'lodash-es/floor';
import _forEach from 'lodash-es/forEach';
import _get from 'lodash-es/get';
import _isNil from 'lodash-es/isNil';
import _isObject from 'lodash-es/isObject';
import _merge from 'lodash-es/merge';
import _set from 'lodash-es/set';
import _isNumber from 'lodash-es/isNumber';
import _times from 'lodash-es/times';
import _toNumber from 'lodash-es/toNumber';

SwiperCore.use([
    EffectCoverflow,
    EffectFade,
    EffectCube,
    EffectFlip,
    Navigation,
    Pagination,
    Autoplay,
    Mousewheel,
    Scrollbar,
    Grid,
]);

@Component({
    selector: '[wlc-slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./styles/slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild(SwiperComponent) public swiper: SwiperComponent;

    @Input() public slides: Params.ISlide[];
    @Input() protected inlineParams: Params.ISliderCParams;

    @Output() protected handleBeforeResize: EventEmitter<SwiperCore> = new EventEmitter();
    @Output() public slideChangeTransitionEnd$ = new EventEmitter<Swiper>();
    @Output() public slideChangeTransitionStart$ = new EventEmitter<Swiper>();

    public sliderWrap: Element;
    public $params: Params.ISliderCParams;

    public ready: boolean = false;
    public slidesSequence: number[] = [];
    public emptySlidesCount: number = 0;
    public slideMaxWidth: number = 0;

    protected observer: MutationObserver;

    private frozenSwiperParams: SwiperOptions;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISliderCParams,
        protected configService: ConfigService,
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

        if (this.$params.events) {
            this.$params.events.pipe(takeUntil(this.$destroy)).subscribe((event) => {
                switch(event) {
                    case 'start':
                        this.swiper.swiperRef?.autoplay.start();
                        break;
                    case 'stop':
                        this.swiper.swiperRef?.autoplay.stop();
                        break;
                }
            });
        }

        this.frozenSwiperParams = _cloneDeep(this.$params.swiper);

        this.initEmptySlidesCount();
        // for fix loop
        this.fixSlidesSequence();
        this.initSubscriptions();
    }

    public initEmptySlidesCount(): void {
        if (this.isAutoSlidesAndColumnMode()) {
            const {swiper} = this.$params;
            if (_isNumber(swiper?.slidesPerView) && swiper?.grid?.rows) {
                const groupCount: number = swiper.slidesPerView * swiper.grid.rows;
                const fullFilledSlides: number = Math.floor(this.slides.length / groupCount);
                this.emptySlidesCount = groupCount - (this.slides.length - (groupCount * fullFilledSlides));
            }
        } else {
            this.emptySlidesCount = 0;
        }
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.updateView();
            this.initObserver();
            this.initNavigation();
        }, 0);
        this.initEventHandlers();
        this.ready = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.ready) {
            this.fixSlidesSequence();
            this.cdr.detectChanges();
            this.update();
        }

        const navigation = _get(changes, 'inlineParams.currentValue.swiper.navigation') as NavigationOptions | boolean;
        if (!_isNil(navigation) && !changes['inlineParams'].firstChange) {
            this.updateNavigation(navigation);
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

    public onUpdate(): void {
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
        this.updateProgressModifiers(this.swiper?.swiperRef);
    }

    public scrollToStart(): void {
        this.swiper.swiperRef.slideTo(0, 0, false);
    }

    public onResize(): void {
        this.updateView();
    }

    public onBeforeResize(): void {
        this.handleBeforeResize.emit(this.swiper.swiperRef);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.observer) {
            this.observer.disconnect();
        }
    }

    protected initNavigation(): void {
        if (this.swiper.swiperRef.navigation) {
            this.swiper.swiperRef.navigation.destroy();
            this.swiper.swiperRef.navigation.init();
            this.swiper.swiperRef.navigation.update();
        }
    }

    protected initObserver(): void {
        this.observer = new MutationObserver(() => {
            this.updateView();
        });
        this.observer.observe(this.sliderWrap, {
            childList: true,
            subtree: true,
        });
    }

    protected setSliderWrapper(): void {
        const swiperContainer: HTMLElement = _get(this.swiper, 'elementRef.nativeElement');
        if (!this.sliderWrap) {
            this.sliderWrap = swiperContainer.querySelector('.swiper-wrapper');
        }
    }

    protected isAutoSlidesAndColumnMode(): boolean {
        return !!(this.$params.swiper?.slidesPerView === 'auto' && this.$params.swiper?.grid?.rows);
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

            const groupCount: number = this.$params.swiper.grid?.rows *
                _ceil(swiperWidth / (firstSlide.offsetWidth + margin));
            const floorGroupCount: number = this.$params.swiper.grid?.rows *
                _floor(swiperWidth / (firstSlide.offsetWidth + margin));
            const minGroup = _ceil(slides.length / this.$params.swiper.grid?.rows)
                * this.$params.swiper.grid?.rows;

            if (this.slides.length < floorGroupCount) {
                this.emptySlidesCount = floorGroupCount - this.slides.length;
            } else if (this.slides.length < groupCount) {
                this.emptySlidesCount = groupCount - this.slides.length;
            } else {
                this.emptySlidesCount = minGroup - this.slides.length;
            }
            this.fixSlidesSequence();
        }

        if (this.swiper) {
            setTimeout(() => {
                if (_get(this.swiper.swiperRef, 'virtualSize', 0) > _get(this.swiper.swiperRef, 'size', 0)) {
                    this.addModifiers('overflow');
                    _set(this.swiper, 'swiperRef.allowTouchMove', true);
                } else {
                    if (this.hasModifier('overflow')) {
                        this.removeModifiers('overflow');
                    }
                    _set(this.swiper, 'swiperRef.allowTouchMove', false);
                }
            });
        }

        this.cdr.detectChanges();
        this.update();
    }

    protected windowResizeHandler(): void {
        this.actionService.windowResize()
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
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
            .subscribe(() => {
                this.updateView();
            });

        this.swiper.s_progress.subscribe((swiper) => {
            this.updateProgressModifiers(swiper[0]);
        });

        this.swiper.s_slideChangeTransitionEnd.pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.slideChangeTransitionEnd$.emit(this.swiper.swiperRef);
            });

        this.swiper.s_slideChangeTransitionStart.pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.slideChangeTransitionStart$.emit(this.swiper.swiperRef);
            });
    }

    protected updateProgressModifiers(swiper): void {
        if (!swiper) {
            return;
        }

        this.removeModifiers(['on-start', 'on-end', 'on-progress']);

        if (swiper.isBeginning) {
            this.addModifiers('on-start');
        } else if (swiper.isEnd) {
            this.addModifiers('on-end');
        } else {
            this.addModifiers('on-progress');
        }
    }

    protected updateNavigation(navigation: NavigationOptions | boolean): void {
        setTimeout(() => {
            if (_isObject(navigation)) {
                this.swiper.swiperRef.params.navigation = _merge<NavigationOptions, NavigationOptions>(
                    Params.defaultNavigationParams,
                    navigation,
                );
            } else {
                this.swiper.swiperRef.params.navigation = navigation;
            }

            if (this.swiper.swiperRef.params.slidesPerView == 'auto') {
                this.swiper.swiperRef.params.slidesPerView = 1;
            }

            this.swiper.swiperRef.navigation.destroy();
            this.swiper.swiperRef.navigation.init();
            this.swiper.swiperRef.navigation.update();
            this.cdr.markForCheck();
        });
    }

    protected initSubscriptions(): void {
        this.$params.scrollToStart$?.subscribe(() => this.scrollToStart());
        this.$params.update$?.subscribe(() => this.update());
    }
}

import {
    AfterViewInit,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
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
    TemplateRef,
    ElementRef,
    NgZone,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import Swiper from 'swiper';
import {SwiperContainer} from 'swiper/element';
import {SwiperOptions} from 'swiper/types/swiper-options';
import {NavigationOptions} from 'swiper/types/modules/navigation';

import {
    ConfigService,
    ActionService,
    TUnknownFunction,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

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

export type TSwiperSlideToEvent = (args: Parameters<Swiper['slideTo']>) => void;

@Component({
    selector: '[wlc-slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./styles/slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @ViewChild('slideShowAll') tplShowAll: TemplateRef<ElementRef>;
    @ViewChild('swiperRef') swiperRef: ElementRef<SwiperContainer> | undefined;

    @Input() public slides: Params.ISlide[];
    @Input() protected inlineParams: Params.ISliderCParams;

    @Output() public slideChangeTransitionEnd$ = new EventEmitter<Swiper>();
    @Output() public slideChangeTransitionStart$ = new EventEmitter<Swiper>();
    @Output() protected handleBeforeResize: EventEmitter<Swiper> = new EventEmitter();

    public swiper: Swiper;
    public sliderWrap: Element;
    public override $params: Params.ISliderCParams;
    public ready: boolean = false;
    public slidesSequence: number[] = [];
    public emptySlidesCount: number = 0;
    public slideMaxWidth: number = 0;

    protected readonly eventHandlers: Record<Params.SwiperEventName, TUnknownFunction> = {
        start: () => this.swiper?.autoplay.start(),
        stop: () => this.swiper?.autoplay.stop(),
        enable: () => this.swiper?.enable(),
        disable: () => this.swiper?.disable(),
        update: this.update.bind(this),
        scrollToStart: this.scrollToStart.bind(this),
        slideTo: ((args) => this.swiper?.slideTo(...args)) as TSwiperSlideToEvent,
    };

    private frozenSwiperParams: SwiperOptions;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISliderCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected injector: Injector,
        protected actionService: ActionService,
        protected ngZone: NgZone,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.slides && !this.slides) {
            this.slides = this.$params.slides;
        }

        if (this.$params.events) {
            this.$params.events
                .pipe(takeUntil(this.$destroy))
                .subscribe(({name, data}) => {
                    this.eventHandlers[name]?.(data);
                });
        }

        this.frozenSwiperParams = _cloneDeep(this.$params.swiper);

        this.initEmptySlidesCount();
        // for fix loop
        this.fixSlidesSequence();
    }

    public initEmptySlidesCount(): void {

        const {swiper} = this.$params;
        if (_isNumber(swiper?.slidesPerView) && swiper.grid?.rows) {
            const groupCount: number = swiper.slidesPerView * swiper.grid.rows;
            const fullFilledSlides: number = Math.floor(this.slides.length / groupCount);
            this.emptySlidesCount = groupCount - (this.slides.length - groupCount * fullFilledSlides);
        } else {
            this.emptySlidesCount = 0;
        }
    }

    public ngAfterViewInit(): void {
        if (this.$params.useStartTimeout) {
            setTimeout(() => {
                this.initEmptySlidesCount();
                this.fixSlidesSequence();
                this.afterViewInit();
            }, 0);
        } else {
            this.afterViewInit();
        }
    }

    public afterViewInit(): void {
        this.ready = true;
        this.swiper = this.swiperRef?.nativeElement.swiper;
        this.cdr.markForCheck();

        if (this.$params.slideShowAll?.use) {
            let templateParams = {item: {}};

            this.slides.push({
                templateRef: this.tplShowAll,
                templateParams: templateParams,
            });
            this.initEmptySlidesCount();
            this.fixSlidesSequence();
        }
        this.updateView();
        this.initNavigation();

        this.initEventHandlers();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (this.ready) {
            this.initEmptySlidesCount();
            this.fixSlidesSequence();
            this.cdr.markForCheck();
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
            const slides: HTMLElement[] = this.swiper?.slides;
            const firstSlide = (slides[0] as HTMLElement);

            _forEach(slides, (slide: HTMLElement) => {
                slide.style.maxWidth = firstSlide.style.width;
            });
            this.cdr.markForCheck();
        }
    }

    public update(): void {
        this.ngZone.runOutsideAngular(() => {
            this.swiper.update();
        });
        this.updateProgressModifiers(this.swiper);
    }

    public scrollToStart(): void {
        this.ngZone.runOutsideAngular(() => {
            this.swiper.slideTo(0, 0, false);
        });
    }

    public onResize(): void {
        this.updateView();
    }

    public onBeforeResize(): void {
        this.handleBeforeResize.emit(this.swiper);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    protected initNavigation(): void {
        if (this.swiper.navigation) {
            this.ngZone.runOutsideAngular(() => {
                this.swiper.navigation.destroy();
                this.swiper.navigation.init();
                this.swiper.navigation.update();
            });
        }
    }

    protected setSliderWrapper(): void {
        if (!this.sliderWrap) {
            this.sliderWrap = this.swiperRef.nativeElement;
        }
    }

    protected isAutoSlidesAndColumnMode(): boolean {
        return !!(this.$params.swiper?.slidesPerView === 'auto' && this.$params.swiper?.grid?.rows);
    }

    protected updateView(): void {
        if (!this.ready) {
            return;
        }

        this.setSliderWrapper();
        const slides: HTMLElement[] = this.swiper?.slides;
        if (slides) {
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
                const swiperContainer: HTMLElement = _get(this.swiperRef, 'nativeElement');
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
        }

        if (this.swiper) {
            setTimeout(() => {
                if (_get(this.swiper, 'virtualSize', 0) > _get(this.swiper, 'size', 0)) {
                    this.addModifiers('overflow');
                    _set(this.swiper, 'allowTouchMove', true);

                    if (this.$params.centeredSlides && !_get(this.swiper.params, 'centeredSlides')) {
                        _set(this.swiper.params, 'centeredSlides', true);
                        _set(this.swiper.params, 'centeredSlidesBounds', true);
                    }
                } else {
                    if (this.hasModifier('overflow')) {
                        this.removeModifiers('overflow');
                    }
                    _set(this.swiper, 'allowTouchMove', false);

                    if (this.$params.centeredSlides && _get(this.swiper.params, 'centeredSlides')) {
                        _set(this.swiper.params, 'centeredSlides', false);
                        _set(this.swiper.params, 'centeredSlidesBounds', false);
                    }
                }
            });
        }

        this.cdr.markForCheck();
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

    protected fillSequence(realSequence: number[], slides: number): number[] {
        let result: number[] = [];
        while (result.length < slides) {
            result = result.concat(realSequence);
        }
        return result;
    }

    protected initEventHandlers(): void {
        this.windowResizeHandler();

        this.ngZone.runOutsideAngular(() => {
            // @ts-ignore not complete interface. TODO after update version swiper
            this.swiper.slidesEl.addEventListener('swiper-slidechangetransitionend', () => {
                this.slideChangeTransitionEnd$.emit(this.swiper);
            });
        });
    }

    protected updateProgressModifiers(swiper: Swiper): void {
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
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                if (_isObject(navigation)) {
                    this.swiper.params.navigation = _merge<NavigationOptions, NavigationOptions>(
                        Params.defaultNavigationParams,
                        navigation,
                    );
                } else {
                    this.swiper.params.navigation = navigation;
                }

                if (this.swiper.params.slidesPerView == 'auto') {
                    this.swiper.params.slidesPerView = 1;
                }

                this.swiper.navigation.destroy();
                this.swiper.navigation.init();
                this.swiper.navigation.update();
                this.cdr.markForCheck();
            });
        });
    }
}

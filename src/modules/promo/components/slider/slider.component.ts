import {
    Component,
    Inject,
    Input,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef,
    Renderer2,
    ViewEncapsulation,
    OnChanges,
    Injector,
    ChangeDetectorRef,
} from '@angular/core';
import {SwiperDirective} from 'ngx-swiper-wrapper';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {
    BannersService,
    WinnersService,
} from 'wlc-engine/modules/promo/system/services';

import * as Params from './slider.params';

import {
    assign as _assign,
    isNumber as _isNumber,
    times as _times,
} from 'lodash-es';

@Component({
    selector: '[wlc-slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./styles/slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SliderComponent extends AbstractComponent
    implements OnInit, AfterViewInit, OnChanges {

    @ViewChild(SwiperDirective) public swiper: SwiperDirective;
    @ViewChild('sliderRef') public sliderRef: ElementRef;

    @Input() public slides: Params.ISlide[];
    @Input() protected inlineParams: Params.ISliderCParams;
    public $params: Params.ISliderCParams;

    public ready: boolean = false;
    public slidesSequence: number[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISliderCParams,
        protected configService: ConfigService,
        protected bannersService: BannersService,
        protected winnersService: WinnersService,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer2,
        protected injector: Injector,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.slides && !this.slides) {
            this.slides = this.$params.slides;
        }
        // for fix loop
        this.fixSlidesSequence();
    }

    public ngAfterViewInit(): void {
        this.updateSwiper();
        this.ready = true;
    }

    public ngOnChanges(): void {
        if (this.ready) {
            this.fixSlidesSequence();
            this.updateSwiper();
        }
    }

    public detectSlide(slide: Params.ISlide): string {
        if (slide.component) {
            return 'component';
        } else if (slide.templateRef) {
            return 'templateRef';
        } else if (slide.htmlString) {
            return 'htmlString';
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

    protected fixSlidesSequence(): void {
        if (!this.slides?.length) {
            return;
        }

        const {swiper} = this.$params;
        const realSequence: number[] = _times(this.slides.length, (i) => i);

        if (swiper.loop) {
            const slides = _isNumber(swiper.slidesPerView) ? swiper.slidesPerView : 5;
            if (slides > this.slides.length) {
                this.slidesSequence = this.fillSequence(realSequence, slides);
                return;
            }

            this.slidesSequence = realSequence;
            return;
        }

        this.slidesSequence = realSequence;
    }

    protected fillSequence(realSequence: number[], slides: number) {
        let result: number[] = [];
        while (result.length < slides) {
            result = result.concat(realSequence);
        }
        return result;
    }

    protected updateSwiper(): void {
        const {swiper} = this.$params;

        if (swiper.autoplay) {
            this.swiper.stopAutoplay(true);
        }

        if (swiper.loop) {
            // loop fix
            this.swiper.swiper().loopDestroy();
            this.swiper.swiper().loopCreate();
        }

        if (swiper.autoplay) {
            this.swiper.startAutoplay();
        }

        this.swiper.swiper().update();

        this.cdr.detectChanges();
    }
}

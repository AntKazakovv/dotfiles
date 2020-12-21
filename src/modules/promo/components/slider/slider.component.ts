import {
    Component,
    Inject,
    Input,
    OnInit,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
    Renderer2,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
    Injector,
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
} from 'lodash';

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
    }

    public ngAfterViewInit(): void {
        this.prepareControls();
        this.swiper.init();
        this.ready = true;
    }

    public ngOnChanges(): void {
        if (this.ready) {
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

    protected updateSwiper(): void {
        const {swiper} = this.$params;

        this.swiper.update();

        if (swiper.loop) {
            // restart loop on dynamically changing slides
            this.swiper.swiper().loopCreate();
            this.swiper.swiper().loopFix();
        }

        if (swiper.autoplay) {
            this.swiper.startAutoplay();
        }
    }

    protected prepareControls(): void {
        const {swiper} = this.$params;
        const wrapper = this.sliderRef.nativeElement;

        if (swiper.navigation) {
            const navigation = this.renderer.createElement('div');
            this.renderer.addClass(navigation, 'swiper-navigation');

            const navigationPrev = this.renderer.createElement('div');
            this.renderer.addClass(navigationPrev, 'swiper-button-prev');

            const navigationNext = this.renderer.createElement('div');
            this.renderer.addClass(navigationNext, 'swiper-button-next');

            this.renderer.appendChild(navigation, navigationNext);
            this.renderer.appendChild(navigation, navigationPrev);

            this.renderer.appendChild(wrapper, navigation);
        }

        if (swiper.pagination) {
            const pagination = this.renderer.createElement('div');
            this.renderer.addClass(pagination, 'swiper-pagination');

            this.renderer.appendChild(wrapper, pagination);
        }

        if (swiper.scrollbar) {
            const scrollbar = this.renderer.createElement('div');
            this.renderer.addClass(scrollbar, 'swiper-scrollbar');

            this.renderer.appendChild(wrapper, scrollbar);
        }
    }
}

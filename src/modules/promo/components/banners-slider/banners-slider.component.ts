import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {BannersService} from 'wlc-engine/modules/promo/system/services';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';

import * as Params from './banners-slider.params';

import _merge from 'lodash-es/merge';

@Component({
    selector: '[wlc-banners-slider]',
    templateUrl: './banners-slider.component.html',
    styleUrls: ['./styles/banners-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannersSliderComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBannersSliderCParams;

    public override $params: Params.IBannersSliderCParams;
    public ready: boolean = false;
    public slides: ISlide[] = [];
    public useNavigation: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBannersSliderCParams,
        configService: ConfigService,
        protected bannerService: BannersService,
        cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.createSlides();

        setTimeout(() => {
            this.ready = true;
            this.useNavigation = !this.$params.hideNavigation && this.slides.length > 1;
            this.cdr.detectChanges();
        });

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            setTimeout(() => {
                this.createSlides();
                this.cdr.markForCheck();
            });
        });
    }

    protected createSlides(): void {
        this.slides = this.getBanners().map((item: BannerModel) => {
            return {
                component: BannerComponent,
                componentParams: _merge(
                    {theme: this.$params.theme},
                    this.$params.banner,
                    {banner: item},
                ),
            };
        });

        if (this.slides.length <= 1) {
            this.$params.sliderParams.swiper.loop = false;
        }
    }

    protected getBanners(): BannerModel[] {
        return this.bannerService.getBanners(this.$params.filter || {});
    }
}

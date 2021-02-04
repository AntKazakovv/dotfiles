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
} from 'wlc-engine/modules/core';
import {ISlide} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {BannersService} from 'wlc-engine/modules/promo/system/services';
import {BannerModel} from 'wlc-engine/modules/promo/system/models/banner.model';
import {BannerComponent} from 'wlc-engine/modules/promo/components/banner/banner.component';

import * as Params from './banners-slider.params';

import {
    merge as _merge,
} from 'lodash-es';

@Component({
    selector: '[wlc-banners-slider]',
    templateUrl: './banners-slider.component.html',
    styleUrls: ['./styles/banners-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannersSliderComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IBannersSliderCParams;

    public $params: Params.IBannersSliderCParams;
    public ready: boolean = false;
    public slides: ISlide[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBannersSliderCParams,
        protected configService: ConfigService,
        protected bannerService: BannersService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.createSlides();
        setTimeout(() => {
            this.ready = true;
            this.cdr.detectChanges();
        }, 0);
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
    }

    protected getBanners(): BannerModel[] {
        return this.bannerService.getBanners(this.$params.filter || {});
    }
}

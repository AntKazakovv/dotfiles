import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    EventService,
    ISlide,
} from 'wlc-engine/modules/core';
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
        protected bannerService: BannersService,
        protected eventService: EventService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.bannerService.readyStatus.promise;

        this.createSlides();

        setTimeout(() => {
            this.ready = true;
            this.useNavigation = !this.$params.hideNavigation && this.slides.length > 1;
            this.cdr.markForCheck();
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

        // TODO это временное решение, необходимо дождаться обновление свайпера в котором пофиксят режим цикла
        if (this.$params.themeMod === 'ears'
            && this.slides.length <= 3
            && this.slides.length > 1
        ) {
            this.slides = Array.from({length: 2}, () => this.slides).flat();
        }
    }

    protected getBanners(): BannerModel[] {
        return this.bannerService.getBanners(this.$params.filter || {});
    }
}

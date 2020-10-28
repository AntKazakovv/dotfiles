import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {BannersService} from 'wlc-engine/modules/promo/services';
import {BannerModel} from 'wlc-engine/modules/promo/models/banner.model';
import {IBannersFilter} from 'wlc-engine/modules/promo/services/banners/banners.service';
import {ISliderParams, defaultParams, ISlides} from 'wlc-engine/modules/promo/components/slider/slider.params';

@Component({
    selector: '[slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: ISliderParams;
    public $params: ISliderParams;
    public slides: ISlides[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: ISliderParams,
        protected bannersService: BannersService,
    ) {
        super({injectParams, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getSlides();
    }

    public getSlides(): void {

        for (const slide of this.$params.slides) {

            switch(slide.component) {
            case 'banner':
                const banners = this.getBanners(slide.params.filter);
                this.slides.push(...banners.map(el => ({
                    component: slide.component,
                    params: el,
                })));
                break;
            }
        }
    }

    protected getBanners(filter?: IBannersFilter): BannerModel[] {
        return this.bannersService.getBanners(filter);
    }
}

import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {BannersService} from 'wlc-engine/modules/promo/services';
import {BannerModel} from 'wlc-engine/modules/promo/models/banner.model';
import {IBannersFilter} from 'wlc-engine/modules/promo/services/banners/banners.service';
import * as Params from 'wlc-engine/modules/promo/components/slider/slider.params';

interface ISlide {
    component: 'banner';
    params: BannerModel;
}

/**
 * Wrapper for slider slick. Takes a set of components and their parameters.
 *
 * @example
 *
 * {
 *     name: 'promo.wlc-slider',
 *     params: {
 *         swiper: {
 *             slidesPerView: 1,
 *             pagination: {
 *                 type: 'bullets',
 *                 el: '.swiper-pagination',
 *                 clickable: true,
 *             },
 *         },
 *         slides: [
 *             {
 *                 component: 'banner',
 *                 params: {
 *                     filter: {
 *                         position: ['home'],
 *                     },
 *                 },
 *             },
 *         ],
 *     },
 * }
 *
 */
@Component({
    selector: '[slider]',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISliderCParams;
    public $params: Params.ISliderCParams;
    /**
     * A set of slides displayed in a template.
     */
    public slides: ISlide[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISliderCParams,
        protected bannersService: BannersService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getSlides();
    }

    protected getSlides(): void {

        for (const slide of this.$params?.slides) {

            switch(slide.component) {
                case 'banner':
                    const banners = this.getBanners(slide.params?.filter);
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

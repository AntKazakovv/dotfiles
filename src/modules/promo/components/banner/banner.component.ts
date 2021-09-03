import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {BannersService, IBannersFilter} from 'wlc-engine/modules/promo/system/services/banners/banners.service';
import * as Params from './banner.params';

/**
 * Displaying banners, takes BannerModel as a parameter.
 *
 * @example
 * {
 *     name: 'promo.wlc-banner',
 *     params: {
 *         filter: {
 *             position: ['any'],
 *         },
 *     },
 * }
 */
@Component({
    selector: '[wlc-banner]',
    templateUrl: './banner.component.html',
    styleUrls: ['./styles/banner.component.scss'],
})
export class BannerComponent extends AbstractComponent implements OnInit {
    public $params: Params.IBannerCParams;

    @Input() protected inlineParams: Params.IBannerCParams;
    @Input() protected themeMod: Params.ComponentMod;
    @Input() protected filter: IBannersFilter;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IBannerCParams,
        protected bannersService: BannersService,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getBanner();
    }

    protected getBanner(): void {
        if (this.$params.banner || !this.$params.filter) {
            return;
        }
        this.$params.banner = this.bannersService.getBanners(this.$params.filter).shift();
    }
}

import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {defaultParams, IBannerCParams} from 'wlc-engine/modules/promo/components/banner/banner.params';

/**
 * Displaying banners, takes BannerModel as a parameter.
 *
 * @example
 *
 * {
 *     name: 'promo.wlc-banner',
 *     params: {
 *         html: "<p>Test test test</p>"
 *     },
 * }
 *
 */
@Component({
    selector: '[wlc-banner]',
    templateUrl: './banner.component.html',
    styleUrls: ['./styles/banner.component.scss'],
})
export class BannerComponent extends AbstractComponent implements OnInit {
    public $params: IBannerCParams;

    @Input() protected inlineParams: IBannerCParams;

    constructor(
        @Inject('injectParams') protected injectParams: IBannerCParams,
    ) {
        super({injectParams, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}

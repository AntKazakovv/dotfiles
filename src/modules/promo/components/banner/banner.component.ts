import {Component, Inject, Input, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {defaultParams, IBannerParams} from 'wlc-engine/modules/promo/components/banner/banner.params';

@Component({
    selector: '[banner]',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})

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
export class BannerComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: IBannerParams;

    constructor(
        @Inject('injectParams') protected injectParams: IBannerParams,
    ) {
        super({injectParams, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}

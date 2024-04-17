import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

import * as Params from './store-item-price.params';

@Component({
    selector: '[wlc-store-item-price]',
    templateUrl: './store-item-price.component.html',
    styleUrls: ['./styles/store-item-price.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreItemPriceComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IStoreItemPriceCParams;

    @Input() protected inlineParams: Params.IStoreItemPriceCParams;
    @Input() public theme: Params.ComponentTheme;
    @Input() public priceLoyalty: number;
    @Input() public priceExp: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreItemPriceCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}

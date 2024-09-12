import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import {AbstractComponent, GlobalHelper} from 'wlc-engine/modules/core';
import {IStoreItemTotalPrice} from 'wlc-engine/modules/store/system/interfaces/store.interface';

import * as Params from './store-item-price.params';

@Component({
    selector: '[wlc-store-item-price]',
    templateUrl: './store-item-price.component.html',
    styleUrls: ['./styles/store-item-price.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreItemPriceComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IStoreItemPriceCParams;
    @Input() public storeItemTotalPrice: IStoreItemTotalPrice;

    public override $params: Params.IStoreItemPriceCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreItemPriceCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public getCurrencyIconUrl(currency: string): string {
        return GlobalHelper.proxyUrl(`/wlc/icons/currencies/${currency.toLowerCase()}.svg`);
    }
}

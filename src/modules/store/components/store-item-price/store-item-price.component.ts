import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';
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

    protected readonly WalletHelper = WalletHelper;

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

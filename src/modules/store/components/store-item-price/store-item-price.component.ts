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
    public storeItemTotalPriceHistory: IStoreItemTotalPrice;

    protected readonly isMultiWallet: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

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
        this.storeItemTotalPriceHistory ??= this.$params.storeItemTotalPrice;
    }

    public get isNeedCurrencyIcon(): boolean {
        return (!this.$params.isHistory || this.isMultiWallet);
    }

    public get hasPrice(): boolean {
        return Object.values(this.storeItemTotalPriceHistory).some(elem => !!elem);
    }

    public get isHistory(): boolean {
        return this.$params.isHistory;
    }

    public getCurrencyIconUrl(currency: string): string {
        return GlobalHelper.proxyUrl(`/wlc/icons/currencies/${currency.toLowerCase()}.svg`);
    }
}

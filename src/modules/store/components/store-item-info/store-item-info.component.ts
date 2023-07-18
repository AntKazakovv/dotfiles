import {
    ChangeDetectionStrategy,
    Component,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {StoreItem} from 'wlc-engine/modules/store';

import * as Params from './store-item-info.params';

interface IScope {
    storeItem: StoreItem;
}

@Component({
    selector: '[wlc-store-item-info]',
    templateUrl: './store-item-info.component.html',
    styleUrls: ['./styles/store-item-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreItemInfoComponent extends AbstractComponent {
    public override $params: Params.IStoreItemInfoCParams;
    public isMultiWallet: boolean;

    public get scope(): IScope {
        return {
            storeItem: this.$params.storeItem,
        };
    };

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreItemInfoCParams,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemInfoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
    }

    public get showMultyWalletWarning(): boolean {
        return this.isMultiWallet
            && (this.$params.storeItem.type === 'Money' || this.$params.storeItem.type === 'MoneyBonus');
    }
}

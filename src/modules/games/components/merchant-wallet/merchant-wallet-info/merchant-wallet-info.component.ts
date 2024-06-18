import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './merchant-wallet-info.params';

@Component({
    selector: '[wlc-merchant-wallet-info]',
    templateUrl: './merchant-wallet-info.component.html',
    styleUrls: ['./styles/merchant-wallet-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MerchantWalletInfoComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IMerchantWalletInfoCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletInfoCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

}

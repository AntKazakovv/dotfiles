import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {WlcModalComponent} from 'wlc-engine/standalone/core/components/modal/modal.component';

import * as Params from './store-item-info.params';

@Component({
    selector: '[wlc-store-item-info]',
    templateUrl: './store-item-info.component.html',
    styleUrls: ['./styles/store-item-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreItemInfoComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IStoreItemInfoCParams;

    public override $params: Params.IStoreItemInfoCParams;
    public isMultiWallet: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IStoreItemInfoCParams,
        @Inject(WlcModalComponent) protected modal: WlcModalComponent,
        configService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.IStoreItemInfoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);

        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public get showMultyWalletWarning(): boolean {
        return this.isMultiWallet
            && (this.$params.storeItem.type === 'Money' || this.$params.storeItem.type === 'MoneyBonus');
    }

    public closeModal(): void {
        this.modal.closeModalByReason('closeButton');
    }

    public showConfirmationModal(): void {
        this.modalService.showModal('storeConfirmation', {
            storeItem: this.$params.storeItem,
            storeItemTotalPrice: this.$params.storeItemTotalPrice,
        });
    }
}

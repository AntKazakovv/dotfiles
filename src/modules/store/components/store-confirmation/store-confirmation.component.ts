import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {AbstractModalComponent} from 'wlc-engine/modules/core/system/classes';
import {StoreService} from 'wlc-engine/modules/store';

import * as Params from 'wlc-engine/modules/store/components/store-confirmation/store-confirmation.params';


@Component({
    selector: '[wlc-store-confirmation]',
    templateUrl: './store-confirmation.component.html',
    styleUrls: ['./styles/store-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreConfirmationComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() protected inlineParams: Params.IStoreConfirmationCParams;

    public override $params: Params.IStoreConfirmationCParams;

    protected buyClick: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.IStoreConfirmationCParams,
        protected readonly modal: AbstractModalComponent,
        protected storeService: StoreService,
    ) {
        super(
            <IMixedParams<Params.IStoreConfirmationCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.configService.get<boolean>('$base.useButtonPending')) {
            GlobalHelper.addPendingToBtnsParams(this.$params.btnsParams);
        }
    }

    public async buyItem(): Promise<void> {
        this.$params.btnsParams.buyBtnParams.pending$?.next(true);
        this.buyClick = true;
        await this.storeService.buyItem(this.$params.storeItem.id);
        this.closeModal();
    }

    public closeModal(): void {
        this.modal.closeModalByReason('closeButton');
    }
}

import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './cancel-raffle.params';

@Component({
    selector: '[wlc-cancel-raffle]',
    templateUrl: './cancel-raffle.component.html',
    styleUrls: ['./styles/cancel-raffle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CancelRaffleComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ICancelRaffleCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ICancelRaffleCParams,

        configService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(<IMixedParams<Params.ICancelRaffleCParams>>{
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.modalService.hideModal('waiting-results');
    }

    protected close(): void {
        this.modalService.closeAllModals();
    }
}

import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './transaction-status.params';

@Component({
    selector: '[wlc-transaction-status]',
    templateUrl: './transaction-status.component.html',
    styleUrls: ['./transaction-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionStatusComponent extends AbstractComponent implements OnInit {

    public override $params: Params.ITransactionStatusParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionStatusParams,
    ) {
        super(
            <IMixedParams<Params.ITransactionStatusParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }
}

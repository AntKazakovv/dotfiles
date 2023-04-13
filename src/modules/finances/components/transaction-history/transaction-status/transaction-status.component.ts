import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './transaction-status.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-transaction-status]',
    templateUrl: './transaction-status.component.html',
    styleUrls: ['./transaction-status.component.scss'],
})
export class TransactionStatusComponent extends AbstractComponent implements OnInit {

    public override $params: Params.ITransactionStatusParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionStatusParams,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ITransactionStatusParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, null, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }
}

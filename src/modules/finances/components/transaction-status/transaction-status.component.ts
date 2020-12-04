import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/classes/abstract.component';
import * as Params from './transaction-status.params';

@Component({
    selector: '[wlc-transaction-status]',
    templateUrl: './transaction-status.component.html',
    styleUrls: ['./transaction-status.component.scss'],
})
export class TransactionStatusComponent extends AbstractComponent implements OnInit {

    public $params: Params.ITransactionStatusParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionStatusParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ITransactionStatusParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }
}

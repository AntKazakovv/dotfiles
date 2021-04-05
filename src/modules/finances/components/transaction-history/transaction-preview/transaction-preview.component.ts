import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {
    EventService,
} from 'wlc-engine/modules/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {Transaction} from 'wlc-engine/modules/finances/system/models/transaction-history.model';
import {IBet} from 'wlc-engine/modules/finances/system/interfaces';

import * as Params from './transaction-preview.params';

@Component({
    selector: '[wlc-transaction-preview]',
    templateUrl: './transaction-preview.component.html',
    styleUrls: ['./styles/transaction-preview.component.scss'],
})
export class TransactionPreviewComponent extends AbstractComponent implements OnInit {

    public $params: Params.ITransactionPreviewParams;
    public date: string;
    public amount: number;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionPreviewParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.ITransactionPreviewParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        if (this.$params.transaction instanceof Transaction) {
            this.date = this.$params.transaction.initialDate;
            this.amount = this.$params.transaction.amount;
        } else {
            this.date = this.$params.transaction.Date;
            this.amount = +this.$params.transaction.Amount;
        }
    }

    public getPaymentStatus(): string {
        const className = this.$params.transaction instanceof Transaction ?
            this.$params.transaction.type === 'Debit' :
            this.$params.transaction.Action === 'bet';
        return className ? 'danger' : 'success';
    }
}

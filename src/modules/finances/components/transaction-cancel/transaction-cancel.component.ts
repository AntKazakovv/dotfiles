import {Component, OnInit, ChangeDetectorRef, Inject} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/services';
import {FinancesService} from 'wlc-engine/modules/finances/services/finances/finances.service';
import * as Params from './transaction-cancel.params';

@Component({
    selector: '[wlc-transaction-cancel]',
    templateUrl: './transaction-cancel.component.html',
    styleUrls: ['./transaction-cancel.component.scss'],
})
export class TransactionCancelComponent extends AbstractComponent implements OnInit {

    public $params: Params.ITransactionCancelParams;
    protected inProgress: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionCancelParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.ITransactionCancelParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
    }

    public async cancel(): Promise<void> {

        console.log('cccc');

        if (this.$params.transaction.cancelProgress) {
            return;
        }

        this.$params.transaction.cancelProgress = true;
        try {
            await this.financesService.cancelWithdrawal(this.$params.transaction.id);
            this.$params.transaction.setStatus(-55);
        } catch (error) {
            this.modalService.showError({
                id: 'cancel-transaction-error-' + this.$params.transaction.id,
                modalMessage: error.errors?.length ? error.errors : gettext('Something went wrong. Please try again later.'),
            });
        } finally {
            this.$params.transaction.cancelProgress = false;
        }
    }
}
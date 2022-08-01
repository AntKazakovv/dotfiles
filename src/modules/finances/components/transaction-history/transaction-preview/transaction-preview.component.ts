import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
} from '@angular/core';
import {
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {WINDOW} from 'wlc-engine/modules/app/system';

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
        @Inject(WINDOW) private window: Window,
    ) {
        super(
            <IMixedParams<Params.ITransactionPreviewParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.date = GlobalHelper.toLocalTime(this.$params.transaction.dateISO, 'ISO', 'HH:mm:ss dd-MM-yyyy');
        this.amount = this.$params.transaction.amount;
    }
}

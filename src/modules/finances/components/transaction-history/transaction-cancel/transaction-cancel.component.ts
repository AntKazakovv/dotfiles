import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    HostBinding,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    IPushMessageParams,
    NotificationEvents,
    ConfigService,
} from 'wlc-engine/modules/core';

import {
    FinancesService,
    FinancesHelper,
} from 'wlc-engine/modules/finances';

import * as Params from './transaction-cancel.params';

@Component({
    selector: '[wlc-transaction-cancel]',
    templateUrl: './transaction-cancel.component.html',
    styleUrls: ['./style/transaction-cancel.component.scss'],
})
export class TransactionCancelComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.allow-cancelation') protected allowCancelation: boolean;
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    public $params: Params.ITransactionCancelParams;
    protected inProgress: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionCancelParams,
        protected cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITransactionCancelParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.profileFirst = this.configService.get('$base.profile.type') === 'first';
        this.allowCancelation = this.$params.transaction.allowCancelation;
    }

    public async cancel(): Promise<void> {

        if (this.$params.transaction.cancelProgress) {
            return;
        }

        this.$params.transaction.cancelProgress = true;
        try {
            await this.financesService.cancelWithdrawal(this.$params.transaction.id);
            this.$params.transaction.setStatus(-55);
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Transaction error'),
                    message: FinancesHelper.errorToMessage(error),
                    wlcElement: 'notification_transaction-error',
                },
            });
        } finally {
            this.$params.transaction.cancelProgress = false;
        }
    }
}

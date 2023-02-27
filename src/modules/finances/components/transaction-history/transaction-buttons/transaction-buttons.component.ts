import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    HostBinding,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    EventService,
    IPushMessageParams,
    NotificationEvents,
    ConfigService,
    LogService,
    GlobalHelper,
} from 'wlc-engine/modules/core';

import {
    FinancesService,
} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {
    FinancesHelper,
} from 'wlc-engine/modules/finances/system/helpers/finances.helper';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './transaction-buttons.params';

@Component({
    selector: '[wlc-transaction-buttons]',
    templateUrl: './transaction-buttons.component.html',
    styleUrls: ['./style/transaction-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionButtonsComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.allow-cancelation') protected allowCancelation: boolean;
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    public override $params: Params.ITransactionButtonsParams;
    public showCancelButton: boolean;
    public showConfirmButton: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ITransactionButtonsParams,
        @Inject(WINDOW) protected window: Window,
        cdr: ChangeDetectorRef,
        protected financesService: FinancesService,
        protected eventService: EventService,
        configService: ConfigService,
        protected logService: LogService,
    ) {
        super(
            <IMixedParams<Params.ITransactionButtonsParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.showCancelButton = this.$params.transaction.allowCancelation;
        this.showConfirmButton = this.$params.transaction.requireConfirmation;
        this.allowCancelation = this.showCancelButton || this.showConfirmButton;
        this.profileFirst = this.configService.get('$base.profile.type') === 'first';

        if (this.configService.get<boolean>('$base.useButtonPending')) {
            GlobalHelper.addPendingToBtnsParams(this.$params.btnsParams);
        }
    }

    /**
     * Cancel withdraw
     *
     * @returns {Promise<void>}
     */
    public async cancel(): Promise<void> {

        if (this.$params.transaction.cancelProgress) {
            return;
        }
        this.$params.btnsParams.cancelBtnParams.pending$?.next(true);
        this.$params.transaction.cancelProgress = true;
        try {
            await this.financesService.cancelWithdrawal(this.$params.transaction.id);

        } catch (error) {
            this.logService.sendLog({code: '17.4.0', data: error});
            this.emitError(error);
        } finally {
            this.$params.transaction.cancelProgress = false;
            this.$params.btnsParams.cancelBtnParams.pending$?.next(false);
        }
    }

    /**
     * Confirm withdraw
     *
     * @returns {Promise<void>}
     */
    public async confirm(): Promise<void> {

        if (this.$params.transaction.confirmProgress) {
            return;
        }

        this.$params.btnsParams.confirmBtnParams.pending$?.next(true);
        this.$params.transaction.confirmProgress = true;
        try {
            const response: string[] = await this.financesService.confirmWithdrawal(this.$params.transaction.id);

            if (response[0] === 'redirect' && response[1]) {
                this.window.open(response[1]);
                return;
            }
        } catch (error) {
            this.logService.sendLog({code: '17.5.0', data: error});
            this.emitError(error);
        } finally {
            this.$params.transaction.confirmProgress = false;
            this.$params.btnsParams.confirmBtnParams.pending$?.next(false);
        }
    }

    protected emitError(error: {errors?: any}): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Transaction error'),
                message: FinancesHelper.errorToMessage(error),
                wlcElement: 'notification_transaction-error',
            },
        });
    }
}

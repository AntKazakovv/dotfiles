import {
    ChangeDetectorRef,
    Component,
    OnInit,
    OnDestroy,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {
    LogService,
    ModalService,
    EventService,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {PIQCashierService} from 'wlc-engine/modules/finances/system/services/piq-cashier/piq-cashier.service';
import {FinancesService} from 'wlc-engine/modules/finances/system/services/finances/finances.service';
import {PIQCashierServiceEvents} from 'wlc-engine/modules/finances/system/services/piq-cashier/piq-cashier.service';
import {
    AbstractDepositWithdrawComponent,
} from 'wlc-engine/modules/finances/system/classes/abstract.deposit-withdraw.component';
import * as Params from './piq-cashier.params';

@Component({
    selector: '[wlc-piq-cashier]',
    templateUrl: './piq-cashier.component.html',
    styleUrls: ['./styles/piq-cashier.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PIQCashierComponent
    extends AbstractDepositWithdrawComponent<Params.IPIQCashierCParams>
    implements OnInit, OnDestroy {

    public ready = false;
    public $params: Params.IPIQCashierCParams;

    constructor(
        @Inject(DOCUMENT) protected document: Document,
        @Inject('injectParams') protected injectParams: Params.IPIQCashierCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected financesService: FinancesService,
        protected piqCashierService: PIQCashierService,
        protected logService: LogService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams},
            logService, modalService, configService, injectionService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        if (this.$params.modal) {
            this.eventService.subscribe(
                {
                    name: PIQCashierServiceEvents.loadSuccess,
                    from: 'piq-cashier',
                },
                () => {
                    this.ready = true;
                    this.cdr.markForCheck();
                },
                this.$destroy,
            );
            return;
        }

        await this.onPaymentSystemChange();
        this.setHandlers();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.piqCashierService.closedIframe$) {
            this.piqCashierService.closedIframe$.next();
            this.piqCashierService.closedIframe$.complete();
            this.piqCashierService.closedIframe$ = null;
        }
    }

    /**
     * check is available payment
     */
    public get isAvailablePayment(): boolean {
        return this.$params.modal || !!this.currentSystem;
    }

    protected async onPaymentSystemChange(): Promise<void> {
        this.ready = false;
        this.cdr.detectChanges();

        await this.financesService.fetchPaymentSystems();
        this.currentSystem = this.financesService.getSystemByAlias('paymentiq_cashier');

        if (!this.currentSystem) {
            this.ready = true;
            this.cdr.detectChanges();
            return;
        }

        this.checkUserProfileForPayment();
        if (!this.requiredFieldsKeys.length) {
            await this.piqCashierService.loadPIQCashier(this.currentSystem, null, this.$params.mode);
        } else {
            this.ready = true;
        }

        this.cdr.markForCheck();
    }

    protected setHandlers(): void {
        this.eventService.subscribe(
            {name: 'PROFILE_UPDATE'},
            () => {
                this.onPaymentSystemChange();
            },
            this.$destroy,
        );

        this.eventService.subscribe(
            {
                name: PIQCashierServiceEvents.loadSuccess,
                from: 'piq-cashier',
            },
            () => {
                this.ready = true;
                this.cdr.markForCheck();
            },
            this.$destroy,
        );
    }
}

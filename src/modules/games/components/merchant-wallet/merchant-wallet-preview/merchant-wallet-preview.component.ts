import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {
    distinctUntilChanged,
    tap,
    takeUntil,
} from 'rxjs/operators';

import _isEqual from 'lodash-es/isEqual';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';
import {
    TBalanceTransferMethod,
    IMerchantWalletBalance,
    MerchantWalletService,
} from 'wlc-engine/modules/games/system/services/merchant-wallet/merchant-wallet.service';

import * as Params from './merchant-wallet-preview.params';

@Component({
    selector: '[wlc-merchant-wallet-preview]',
    templateUrl: './merchant-wallet-preview.component.html',
    styleUrls: ['./styles/merchant-wallet-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MerchantWalletPreviewComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMerchantWalletPreviewCParams;

    public $params: Params.IMerchantWalletPreviewCParams;
    public userBalance: IMerchantWalletBalance;
    public isError: boolean;
    public isReady: boolean;
    public isPending: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletPreviewCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected logService: LogService,
        protected merchantWalletService: MerchantWalletService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.merchantWalletService.game) {
            this.isReady = true;
        } else {
            return;
        }

        this.cdr.markForCheck();
        this.initListeners();
    }

    public get merchantName(): string {
        return this.merchantWalletService.merchant.alias;
    }

    /**
     * Transfer button handler
     * @param method transfer method `'deposit' | 'withdraw'`
     */
    public buttonHandler(method: TBalanceTransferMethod): void {
        this.merchantWalletService.openTransferModal(method);
    }

    /**
     * Balance update handler
     */
    public async handleUpdate(): Promise<void> {
        try {
            this.isPending = true;
            this.cdr.markForCheck();
            await this.merchantWalletService.getMWBalance();
        } catch (error) {
            this.isError = true;

            this.logService.sendLog({
                code: '21.0.0',
                data: error,
                from: {
                    component: 'MerchantWalletPreviewComponent',
                    method: 'handleUpdate',
                },
            });
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: this.merchantName,
                    message: error.errors,
                },
            });
        } finally {
            this.isPending = false;
            this.cdr.markForCheck();
        }
    }

    protected initListeners(): void {
        this.merchantWalletService.balanceObserver
            .pipe(
                takeUntil(this.$destroy),
                tap((value: IMerchantWalletBalance): void => {
                    this.isError = !!value?.['errors'];
                }),
                distinctUntilChanged(_isEqual),
            )
            .subscribe((value: IMerchantWalletBalance): void => {
                this.userBalance = value;
                this.cdr.markForCheck();
            });
    }

}

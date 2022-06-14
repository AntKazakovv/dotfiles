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
    DeviceType,
    ActionService,
    IWrapperCParams,
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
    @Input() public theme: Params.Theme;
    @Input() protected inlineParams: Params.IMerchantWalletPreviewCParams;

    public buttonsConfig: IWrapperCParams = Params.buttonsDefault;

    public $params: Params.IMerchantWalletPreviewCParams;
    public userBalance: IMerchantWalletBalance;
    public isError: boolean;
    public isReady: boolean;
    public isPending: boolean;
    public isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletPreviewCParams,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected logService: LogService,
        protected merchantWalletService: MerchantWalletService,
        protected actionService: ActionService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.common?.buttons.type === 'resizable') {
            this.buttonsConfig = Params.buttonsResizable;
        }

        if (this.configService.get<boolean>('appConfig.mobile')) {
            this.isMobile = true;
        }

        if (this.merchantWalletService.game) {
            this.isReady = true;
        } else {
            return;
        }

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
                tap((value: IMerchantWalletBalance): void => {
                    this.isError = !!value?.['errors'];
                }),
                distinctUntilChanged(_isEqual),
                takeUntil(this.$destroy),
            )
            .subscribe((value: IMerchantWalletBalance): void => {
                this.userBalance = value;
                this.cdr.markForCheck();
            });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType): void => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;

                if (this.isMobile) {
                    this.addModifiers('mobile');
                } else {
                    this.removeModifiers('mobile');
                }

                this.cdr.detectChanges();
            });
    }
}

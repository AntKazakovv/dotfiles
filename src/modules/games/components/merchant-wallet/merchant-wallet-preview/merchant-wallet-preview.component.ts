import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';
import {
    distinctUntilChanged,
    tap,
    takeUntil,
} from 'rxjs/operators';

import _isEqual from 'lodash-es/isEqual';

import {
    AbstractComponent,
    EventService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
    DeviceType,
    ActionService,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    IMerchantWalletBalance,
    MerchantWalletService,
} from 'wlc-engine/modules/games/system/services/merchant-wallet/merchant-wallet.service';
import {TResponseError} from 'wlc-engine/modules/core/system/services/data/data.service';

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

    public override $params: Params.IMerchantWalletPreviewCParams;
    public userBalance: IMerchantWalletBalance;
    public isError: boolean;
    public isReady: boolean;
    public isPending: boolean;
    public isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletPreviewCParams,
        protected eventService: EventService,
        protected logService: LogService,
        protected merchantWalletService: MerchantWalletService,
        protected actionService: ActionService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
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
        this.merchantWalletService.balanceError$
            .pipe(
                tap((error: TResponseError): void => {
                    this.isError = !!error;
                }),
                distinctUntilChanged(_isEqual),
                takeUntil(this.$destroy),
            )
            .subscribe((): void => {
                this.cdr.markForCheck();
            });

        this.merchantWalletService.balanceObserver
            .pipe(
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

        this.eventService.subscribe({
            name: Params.MerchantWalletEvents.Deposit,
        }, () => {
            this.merchantWalletService.openTransferModal('deposit');
        }, this.$destroy);

        this.eventService.subscribe({
            name: Params.MerchantWalletEvents.Withdraw,
        }, () => {
            this.merchantWalletService.openTransferModal('withdraw');
        }, this.$destroy);
    }
}

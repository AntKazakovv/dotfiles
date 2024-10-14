import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    EventService,
    ModalService,
    IButtonCParams,
    IAlertCParams,
} from 'wlc-engine/modules/core';
import {CurrenciesInfo} from 'wlc-engine/modules/core/constants';
import {Bonus} from 'wlc-engine/modules/bonuses';
import {
    IAmount,
    IWalletConfirmController,
    TWalletConfirmItem,
} from '../../system/interfaces';
import {
    WalletConfirmBaseController,
    WalletConfirmBonusController,
    WalletConfirmStoreController,
    WalletConfirmTournamentController,
} from '../../system/controllers/';
import {WalletsService} from '../../system/services/wallets.service';
import {WalletsParams} from '../../components/wallets/wallets.params';

import * as Params from './wallet-confirm.params';

@Component({
    selector: '[wlc-wallet-confirm]',
    templateUrl: './wallet-confirm.component.html',
    styleUrls: ['./styles/wallet-confirm.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        WalletConfirmBaseController,
        WalletConfirmBonusController,
        WalletConfirmStoreController,
        WalletConfirmTournamentController,
    ],
})

export class WalletConfirmComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IWalletConfirmCParams;
    public override $params: Params.IWalletConfirmCParams;
    public readonly walletsService: WalletsService = inject(WalletsService);
    public readonly isReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected readonly modalService: ModalService = inject(ModalService);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly translateService: TranslateService = inject(TranslateService);
    protected controller: IWalletConfirmController = inject(WalletConfirmBaseController);
    protected pending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected _balanceAlertParams!: IAlertCParams;
    protected _walletsParams!: WalletsParams;
    protected _subscribeBtnParams!: IButtonCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWalletConfirmCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareParams();
        this.walletsService.readyMultiWallet.then(() => {
            this.isReady$.next(true);
        });
    }

    public get type(): Params.ComponentType {
        return this.$params.type;
    }

    public get debitAmount(): IAmount[] {
        return this.controller.debitAmount;
    }

    public get creditAmount(): IAmount[] {
        return this.controller.creditAmount;
    }

    public get decorUrl(): string {
        return this.$params.decorUrl;
    }

    public get showDecor(): boolean {
        return this.decorUrl && !this.isTournament;
    }

    public get isTournament(): boolean {
        return this.type === 'tournament';
    }

    public get hasCreditAmount(): boolean {
        return !!this.creditAmount.length;
    }

    public get depositBtnParams(): IButtonCParams {
        return this.$params.depositBtnParams;
    }

    public get isBalanceEnough(): boolean {
        return this.controller.isBalanceEnough;
    }

    public get balanceAlertParams(): IAlertCParams {
        return this._balanceAlertParams;
    }

    protected get model(): TWalletConfirmItem {
        return this.$params.model;
    }

    public get subscribeBtnParams(): IButtonCParams {
        return this._subscribeBtnParams;
    }

    public get walletsParams(): WalletsParams {
        return this._walletsParams;
    }

    public get showSubscribeWarning(): boolean {

        if (this.$params.type === 'bonus') {
            return (this.model as Bonus).stackIsUnavailable;
        }

        return false;
    }

    public getCurrencyIconUrl(currency: string): string {
        return this.walletsService.getCurrencyIconUrl(currency);
    }

    public async subscribeHandler(): Promise<void> {
        try {
            this.pending$.next(true);
            await this.controller.subscribe();
        } finally {
            this.pending$.next(false);
            this.closeModal();
        }
    }

    public closeModal(): void {
        return this.modalService.hideModal('wallet-confirm', 'wallet-confirm.component', 'success');
    }

    public getAmountCurrency(amount: IAmount): string {
        return amount.conversionCurrency && !CurrenciesInfo.specialCurrencies.has(amount.currency)
            ? amount.conversionCurrency
            : amount.currency;
    }

    public getDigitsInfo(amount: IAmount): string {
        return CurrenciesInfo.specialCurrencies.has(amount.currency)
            ? '1-0-0'
            : '1-2-8';
    }

    public showValueOnly(amount: IAmount): boolean {
        return !(CurrenciesInfo.specialCurrencies.has(amount.currency) || amount.conversionCurrency);
    }

    public showCurrencyIcon(amount: IAmount): boolean {
        return !CurrenciesInfo.specialCurrencies.has(amount.currency);
    }

    protected prepareParams(): void {
        this.prepareSubscribeBtnParams();
        this.prepareWalletsParams();
        this.prepareBalanceAlertParams();
    }

    protected prepareSubscribeBtnParams(): void {
        this._subscribeBtnParams = {
            pending$: this.pending$,
            common: {
                text: this.$params.buttonCaptions[this.type],
            },
        };
    }

    protected prepareWalletsParams(): void {
        this._walletsParams = {
            ...this.$params.walletsParams,
            onWalletChange: this.controller.onWalletChange.bind(this.controller),
        };
    }

    protected prepareBalanceAlertParams(): void {
        const rawParams: IAlertCParams = this.$params.alertsParams?.balance;

        if (rawParams) {
            this._balanceAlertParams = {
                ...rawParams,
                title: this.translateService.instant(rawParams.title),
            };
        }
    }
}

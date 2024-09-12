import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    inject,
} from '@angular/core';

import {
    AbstractComponent,
    EventService,
    IWrapperCParams,
    ModalService,
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
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

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
    public isMultiWallet: boolean;
    public walletsParams: IWrapperCParams;
    public subscribeButtonText: string = gettext('Subscribe');
    public readonly walletsService: WalletsService = inject(WalletsService);

    protected controller: IWalletConfirmController = inject(WalletConfirmBaseController);
    protected modalService: ModalService = inject(ModalService);
    protected eventService: EventService = inject(EventService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWalletConfirmCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareParams();
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

    protected get model(): TWalletConfirmItem {
        return this.$params.model;
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
        await this.controller.subscribe();
        this.closeModal();
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
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
        this.subscribeButtonText = this.$params.buttonCaptions[this.type];

        if (this.isMultiWallet) {
            this.prepareWalletsParams();
        }
    }

    protected prepareWalletsParams(): void {
        this.walletsParams = {
            components: [
                {
                    name: 'multi-wallet.wlc-wallets',
                    params: {
                        ...this.$params.walletsParams,
                        onWalletChange: this.controller.onWalletChange.bind(this.controller),
                    },
                },
            ],
        };
    }
}

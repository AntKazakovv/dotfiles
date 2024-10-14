import {
    Inject,
    inject,
    Injectable,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
} from 'rxjs';

import {
    StoreItem,
    StoreService,
} from 'wlc-engine/modules/store';

import {ISelectedWallet} from 'wlc-engine/modules/multi-wallet';
import {
    IAmount,
    IWalletConfirmController,
} from '../interfaces';
import {IWalletConfirmCParams} from '../../components/wallet-confirm/wallet-confirm.params';

@Injectable()
export class WalletConfirmStoreController implements IWalletConfirmController {
    public debitAmount: IAmount[] = [];
    public creditAmount: IAmount[] = [];
    public wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);
    public $destroy: Subject<void> = new Subject();

    protected storeService: StoreService = inject(StoreService);
    protected _isBalanceEnough: boolean = false;

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
    ) {}

    public get model(): StoreItem {
        return this.params.model as StoreItem;
    }

    public async subscribe(): Promise<void> {
        await this.storeService.buyItem(this.model.id, 1, this.wallet$.getValue()?.walletId);
    }

    public get isBalanceEnough(): boolean {
        return this._isBalanceEnough;
    }

    public onWalletChange(wallet: ISelectedWallet, balance): void {
        this.wallet$.next(wallet);
        this.calcAmount(wallet);
        this.checkEnoughBalance(balance, wallet.walletCurrency);
    }

    protected calcAmount(wallet: ISelectedWallet): void {
        if (this.model.type === 'Money') {
            this.debitAmount = this.model.getPriceAmount(wallet.walletCurrency);
            this.creditAmount = this.model.getValueAmount(wallet.walletCurrency);
        } else {
            this.debitAmount = this.model.getPriceAmount(wallet.walletCurrency);
        }
    }

    protected checkEnoughBalance(balance: number, currency: string): void {
        if (this.model.type !== 'Bonus') {
            this._isBalanceEnough = true;
            return;
        }

        this._isBalanceEnough = this.model.checkBalance(balance, currency);
    }
}

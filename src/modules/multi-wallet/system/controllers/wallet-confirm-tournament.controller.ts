import {
    Inject,
    inject,
    Injectable,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';

import {
    IAmount,
    ISelectedWallet,
    IWalletConfirmController,
} from '../interfaces';
import {IWalletConfirmCParams} from '../../components/wallet-confirm/wallet-confirm.params';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';

@Injectable()
export class WalletConfirmTournamentController implements IWalletConfirmController {
    public readonly isBalanceEnough$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);
    public debitAmount: IAmount[] = [];
    public feeAmount$: BehaviorSubject<IAmount> = new BehaviorSubject(null);

    protected tournamentsService: TournamentsService = inject(TournamentsService);
    protected counter: number = 0;
    protected _isBalanceEnough: boolean = false;

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
    ) {}

    public get model(): Tournament {
        return this.params.model as Tournament;
    }

    public get isBalanceEnough(): boolean {
        return this._isBalanceEnough;
    }

    public async subscribe(): Promise<void> {
        await this.tournamentsService.joinTournament(this.model, this.wallet$.getValue()?.walletId);
    }

    public onWalletChange(wallet: ISelectedWallet, balance: number): void {
        this.wallet$.next(wallet);
        this.calcDebitAmount(wallet);
        this.checkEnoughBalance(balance, wallet.walletCurrency);
    }

    protected checkEnoughBalance(balance: number, currency: string): void {
        this._isBalanceEnough = this.model.feeType !== 'balance' || this.model.checkBalance(balance, currency);
    }

    protected calcDebitAmount(wallet: ISelectedWallet): void {
        const amount: IAmount = this.model.getFeeAmount(wallet.walletCurrency);
        this.debitAmount = [amount];
    }
}

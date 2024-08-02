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
    public wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);
    public debitAmount: IAmount[] = [];
    public feeAmount$: BehaviorSubject<IAmount> = new BehaviorSubject(null);

    protected tournamentsService: TournamentsService = inject(TournamentsService);

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
    ) {}

    public get model(): Tournament {
        return this.params.model as Tournament;
    }

    public async subscribe(): Promise<void> {
        await this.tournamentsService.joinTournament(this.model, this.wallet$.getValue()?.walletId);
    }

    public onWalletChange(wallet: ISelectedWallet): void {
        this.wallet$.next(wallet);
        this.calcDebitAmount(wallet);
    }

    protected calcDebitAmount(wallet: ISelectedWallet): void {
        const amount: IAmount = this.model.getFeeAmount(wallet.walletCurrency);
        this.debitAmount = [amount];
    }
}

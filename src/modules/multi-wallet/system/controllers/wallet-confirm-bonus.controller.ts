import {
    Inject,
    inject,
    Injectable,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';

import {Bonus} from 'wlc-engine/modules/bonuses/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {IWalletConfirmCParams} from '../../components/wallet-confirm/wallet-confirm.params';
import {
    IAmount,
    ISelectedWallet,
    IWalletConfirmController,
} from '../interfaces';

@Injectable()
export class WalletConfirmBonusController implements IWalletConfirmController {
    public creditAmount: IAmount[] = [];
    public wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);
    public readonly isBalanceEnough: boolean = true;

    protected bonusesService: BonusesService = inject(BonusesService);

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
    ) {}

    public get model(): Bonus {
        return this.params.model as Bonus;
    }

    public async subscribe(): Promise<void> {
        await this.bonusesService.subscribeBonus(this.model, true, this.wallet$.getValue()?.walletId);
    }

    protected updatePrize(wallet: ISelectedWallet): void {
        if (this.model.target !== 'lootbox') {
            this.creditAmount = this.model.getBonusResults(wallet.walletCurrency);
        }
    }

    public onWalletChange(wallet: ISelectedWallet): void {
        this.wallet$.next(wallet);
        this.updatePrize(wallet);
    }
}

import {
    DestroyRef,
    Inject,
    inject,
    Injectable,
    Injector,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
} from 'rxjs';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    IAmount,
    ISelectedWallet,
    IWalletConfirmController,
} from '../interfaces';
import {
    UserInfo,
    UserService,
} from 'wlc-engine/modules/user';
import {WalletConfirmStoreController} from './wallet-confirm-store.controller';
import {WalletConfirmTournamentController} from './wallet-confirm-tournament.controller';
import {WalletConfirmBonusController} from './wallet-confirm-bonus.controller';
import {IWalletConfirmCParams} from '../../components/wallet-confirm/wallet-confirm.params';
import {WalletsService} from '../../system/services/wallets.service';

@Injectable()
export class WalletConfirmBaseController implements IWalletConfirmController {
    protected configService: ConfigService = inject(ConfigService);
    protected eventService: EventService = inject(EventService);
    protected userService: UserService = inject(UserService);
    protected walletsService: WalletsService = inject(WalletsService);
    protected destroyRef: DestroyRef = inject(DestroyRef);
    protected $destroy: Subject<void> = new Subject();
    protected controller: IWalletConfirmController;
    protected wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);
    protected readonly userInfo$: BehaviorSubject<UserInfo>;

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
        private injector: Injector,
    ) {
        this.userInfo$ = this.userService.userInfo$;

        switch (params.type) {
            case 'store':
                this.controller = this.injector.get(WalletConfirmStoreController);
                break;
            case 'tournament':
                this.controller = this.injector.get(WalletConfirmTournamentController);
                break;
            case 'bonus':
                this.controller = this.injector.get(WalletConfirmBonusController);
                break;
        }

        this.destroyRef.onDestroy(() => this.destroy());
    }

    public get debitAmount(): IAmount[] {
        return this.controller.debitAmount || [];
    }

    public get creditAmount(): IAmount[] {
        return this.controller.creditAmount || [];
    }

    public get isBalanceEnough(): boolean {
        return this.controller.isBalanceEnough;
    }

    public async subscribe(): Promise<void> {
        const isWalletExists: boolean = await this.checkWallet();

        if (isWalletExists) {
            await this.controller.subscribe();
        }
    }

    public onWalletChange(wallet: ISelectedWallet): void {
        const balance: number = this.userInfo$.getValue()?.getWalletBalance(wallet.walletCurrency) || 0;;

        this.wallet$.next(wallet);
        this.controller.onWalletChange(wallet, balance);
    }

    /** Checks the wallet. If wallet doesn't exist, creates wallet */
    protected async checkWallet(): Promise<boolean> {
        const wallet = this.wallet$.getValue();

        if (wallet.walletId) {
            return true;
        } else {
            return !!(await this.walletsService.addWallet(wallet.walletCurrency));
        }
    }

    protected destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}

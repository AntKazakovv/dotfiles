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
    UserService,
} from 'wlc-engine/modules/user';
import {WalletConfirmStoreController} from './wallet-confirm-store.controller';
import {WalletConfirmTournamentController} from './wallet-confirm-tournament.controller';
import {WalletConfirmBonusController} from './wallet-confirm-bonus.controller';
import {IWalletConfirmCParams} from '../../components/wallet-confirm/wallet-confirm.params';


@Injectable()
export class WalletConfirmBaseController implements IWalletConfirmController {
    protected configService: ConfigService = inject(ConfigService);
    protected eventService: EventService = inject(EventService);
    protected userService: UserService = inject(UserService);
    protected destroyRef: DestroyRef = inject(DestroyRef);
    protected $destroy: Subject<void> = new Subject();
    protected controller: IWalletConfirmController;
    protected wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);

    constructor(
        @Inject('injectParams') protected readonly params: IWalletConfirmCParams,
        private injector: Injector,
    ) {

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

    public async subscribe(): Promise<void> {
        await this.controller.subscribe();
    }

    public onWalletChange(wallet: ISelectedWallet): void {
        this.wallet$.next(wallet);
        this.controller.onWalletChange(wallet);
    }

    protected destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}

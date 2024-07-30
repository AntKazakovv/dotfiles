import {
    inject,
    Injectable,
    Injector,
} from '@angular/core';

import {
    BehaviorSubject,
    firstValueFrom,
    Subject,
} from 'rxjs';
import {
    filter,
} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    ISelectedWallet,
} from 'wlc-engine/modules/multi-wallet';
import {
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {
    IAmount,
    ILoyaltySubscribeController,
    TLoyaltyItem,
} from 'wlc-engine/modules/loyalty/system/interfaces';
import {StoreSubscribeController} from './store-subscribe.controller';
import {TournamentSubscribeController} from './tournament-subscribe.controller';
import {BonusSubscribeController} from './bonus-subscribe.controller';

import * as LoyaltyConfirmParams from '../../components/loyalty-confirm/loyalty-confirm.params';

@Injectable()
export class LoyaltySubscribeBaseController {
    public ready$: Subject<boolean> = new Subject();
    public wallet$: BehaviorSubject<ISelectedWallet> = new BehaviorSubject(null);

    protected configService: ConfigService = inject(ConfigService);
    protected eventService: EventService = inject(EventService);
    protected userService: UserService = inject(UserService);
    protected $destroy: Subject<void> = new Subject();
    protected controller: ILoyaltySubscribeController;

    private _model!: TLoyaltyItem;

    constructor(
        private injector: Injector,
    ) {}

    public async init(
        model: TLoyaltyItem,
        $destroy: Subject<void>,
        type: LoyaltyConfirmParams.ComponentType,
    ): Promise<void> {
        this._model = model;
        this.$destroy = $destroy;

        switch (type) {
            case 'store':
                this.controller = this.injector.get(StoreSubscribeController);
                break;
            case 'tournament':
                this.controller = this.injector.get(TournamentSubscribeController);
                break;
            case 'bonus':
                this.controller = this.injector.get(BonusSubscribeController);
                break;
        }

        const profile: UserProfile = await firstValueFrom(this.configService
            .get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(filter((profile: UserProfile) => !!profile)));
        const currentWallet: ISelectedWallet = profile.extProfile.currentWallet;

        if (currentWallet) {
            this.wallet$.next(currentWallet);
        }


        this.controller.init(this.model, this.$destroy, this.wallet$);
        this.ready$.next(true);
    }

    public get model(): TLoyaltyItem {
        return this._model;
    }

    public get debitAmount(): IAmount[] {
        return this.controller.debitAmount;
    }

    public get creditAmount(): IAmount[] {
        return this.controller.creditAmount;
    }

    public subscribe(): void {
        this.controller.subscribe();
    }

    public onWalletChange(wallet: ISelectedWallet): void {
        this.wallet$.next(wallet);
    }
}

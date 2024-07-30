import {
    inject,
    Injectable,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
    takeUntil,
} from 'rxjs';

import {Bonus} from 'wlc-engine/modules/bonuses/system/models';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {
    IAmount,
    ILoyaltySubscribeController,
} from 'wlc-engine/modules/loyalty/system/interfaces';

import {ISelectedWallet} from 'wlc-engine/modules/multi-wallet';

@Injectable()
export class BonusSubscribeController implements ILoyaltySubscribeController {
    public debitAmount: IAmount[] = [];
    public creditAmount: IAmount[] = [];
    public wallet$: BehaviorSubject<ISelectedWallet>;
    public $destroy: Subject<void> = new Subject();

    protected bonusesService: BonusesService = inject(BonusesService);

    private _model!: Bonus;

    public init(model: Bonus, $destroy: Subject<void>, wallet$: BehaviorSubject<ISelectedWallet>): void {
        this._model = model;
        this.$destroy = $destroy;
        this.wallet$ = wallet$;

        this.wallet$
            .pipe(takeUntil(this.$destroy))
            .subscribe((wallet: ISelectedWallet) =>{
                this.updatePrize(wallet.walletCurrency);
            });
    }

    public get model(): Bonus {
        return this._model;
    }

    public subscribe(): void {
        // TODO: pass walletId param
        this.bonusesService.subscribeBonus(this.model);
    }

    protected updatePrize(currency: string): void {
        // TODO: implement correct results
        this.creditAmount = [
            {
                value: Number(this.model.value),
                currency: currency,
            },
        ];
    }
}

import {inject, Injectable} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
    takeUntil,
} from 'rxjs';

import {
    IAmount,
    ILoyaltySubscribeController,
} from 'wlc-engine/modules/loyalty/system/interfaces';
import {ISelectedWallet} from 'wlc-engine/modules/multi-wallet';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';

@Injectable()
export class TournamentSubscribeController implements ILoyaltySubscribeController {
    public debitAmount: IAmount[] = [];
    public creditAmount: IAmount[] = [];
    public wallet$: BehaviorSubject<ISelectedWallet>;
    public $destroy: Subject<void> = new Subject();
    public feeAmount$: BehaviorSubject<IAmount> = new BehaviorSubject(null);

    protected tournamentsService: TournamentsService = inject(TournamentsService);

    private _model!: Tournament;

    public init(model: Tournament, $destroy: Subject<void>, wallet$: BehaviorSubject<ISelectedWallet>): void {
        this._model = model;
        this.$destroy = $destroy;
        this.wallet$ = wallet$;

        this.wallet$
            .pipe(takeUntil(this.$destroy))
            .subscribe((wallet: ISelectedWallet) =>{
                let feeAmount: number  = this.model.getFeeAmount(wallet.walletCurrency);

                this.debitAmount = [{
                    currency: wallet.walletCurrency,
                    value: feeAmount,
                }];
            });

    }

    public get model(): Tournament {
        return this._model;
    }

    public subscribe(): void {
        this.tournamentsService.joinTournament(this.model, this.wallet$.getValue().walletId);
    }
}

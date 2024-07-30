import {
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
    ILoyaltySubscribeController,
} from 'wlc-engine/modules/loyalty/system/interfaces';

@Injectable()
export class StoreSubscribeController implements ILoyaltySubscribeController {
    public debitAmount: IAmount[] = [];
    public creditAmount: IAmount[] = [];
    public wallet$: BehaviorSubject<ISelectedWallet>;
    public $destroy: Subject<void> = new Subject();

    protected storeService: StoreService = inject(StoreService);

    private _model!: StoreItem;

    public init(model: StoreItem, $destroy: Subject<void>, wallet$: BehaviorSubject<ISelectedWallet>): void {
        this._model = model;
        this.wallet$ = wallet$;
        this.$destroy = $destroy;
    }

    public get model(): StoreItem {
        return this._model;
    }

    public async subscribe(): Promise<void> {
        // TODO: add implementation
        await this.storeService.buyItem(this.model.id);
    }
}

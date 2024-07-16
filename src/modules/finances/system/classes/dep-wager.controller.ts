import {Injectable, inject} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core';
import {IDepWagerData} from 'wlc-engine/modules/finances/system/interfaces';
import {DepWagerModel} from 'wlc-engine/modules/finances/system/models/dep-wager.model';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';

@Injectable()
export class DepWagerController {
    public readonly depWagerModel$: BehaviorSubject<DepWagerModel> = new BehaviorSubject(null);
    public readonly ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    protected configService: ConfigService = inject(ConfigService);
    protected financesService: FinancesService = inject(FinancesService);

    private _wager!: number;
    private _hasDeposit: boolean = false;

    public async init(): Promise<void> {
        this.ready$.next(false);

        try {
            const data: IDepWagerData[] = await this.financesService.getDepWager();
            this._wager = this.configService.get<number>('$finances.depositWager.wager');

            if (data && data.length) {
                const wagerModel: DepWagerModel = new DepWagerModel(data[0], this._wager);
                this._hasDeposit = true;
                this.depWagerModel$.next(wagerModel);
            }
        } finally {
            this.ready$.next(true);
        }
    }

    public get hasDeposit(): boolean {
        return this._hasDeposit;
    }

    public get wager(): number {
        return this._wager;
    }
}

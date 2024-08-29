import {inject, Injectable} from '@angular/core';

import {
    Observable,
    skip,
} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core';
import {RefInfoModel} from '../models/ref-info.model';
import {ReferralsService} from '../services/referrals.service';

export interface IRefInfoController {
    readonly refInfo$: Observable<RefInfoModel>;
    readonly casinoName: string;
    takeProfit(): void;
};

@Injectable()
export class RefInfoController implements IRefInfoController {
    public readonly refInfo$: Observable<RefInfoModel>;
    public readonly casinoName: string;

    protected readonly configService: ConfigService = inject(ConfigService);
    protected readonly referralsService: ReferralsService = inject(ReferralsService);
    protected readonly siteUrl: string;

    constructor() {
        this.casinoName = this.configService.get<string>('$base.site.name') ?? '';
        this.siteUrl = this.configService.get<string>('appConfig.site') ?? '';

        this.refInfo$ = this.referralsService.refInfo$
            .pipe(
                skip(1),
            );

        this.referralsService.getRefInfo(this.siteUrl);
    }

    public takeProfit(): void {
        this.referralsService.takeProfit()
            .then(() => this.referralsService.getRefInfo(this.siteUrl));
    }
}

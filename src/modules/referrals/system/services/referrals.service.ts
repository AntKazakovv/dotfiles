import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {
    DataService,
    EventService,
    IData,
    IPushMessageParams,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IRefInfo,
    IRefItem,
    IRefList,
    IRefListQueryParams,
    ITakeProfitResponse,
} from 'wlc-engine/modules/referrals/system/interfaces/referrals.interface';
import {RefInfoModel} from 'wlc-engine/modules/referrals/system/models/ref-info.model';

@Injectable({
    providedIn: 'root',
})
export class ReferralsService {
    public refInfo$: BehaviorSubject<RefInfoModel> = new BehaviorSubject(null);

    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected eventService: EventService,
    ) {
        this.registerMethods();
    }

    public async getRefInfo(siteUrl: string): Promise<void> {
        try {
            const refInfoRes = await this.dataService.request<IData<IRefInfo>>('referrals/getReferralInfo');

            this.refInfo$.next(new RefInfoModel(refInfoRes.data, siteUrl));
        } catch (error) {
            this.logService.sendLog({
                code: '32.0.0',
                data: error,
            });
        }
    }

    public async fetchRefList(params: IRefListQueryParams): Promise<IRefItem[]> {
        try {
            const refListRes = await this.dataService.request<IData<IRefList>>('referrals/getReferralsList', params);

            return refListRes.data.referrals;
        } catch (error) {
            this.showReferralError(error.errors);
            this.logService.sendLog({
                code: '32.1.0',
                data: error,
            });
        }
    }

    public async takeProfit(): Promise<void> {
        try {
            const profitRes = await this.dataService.request<IData<ITakeProfitResponse>>('referrals/takeProfit');

            if (profitRes.data.result) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                    },
                });
            }
        } catch (error) {
            this.showReferralError(error.errors);
            this.logService.sendLog({
                code: '32.2.0',
                data: error,
            });
        }
    }

    protected showReferralError(message: string | string[], title: string = gettext('Error')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: 'referrals_error',
            },
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'getReferralInfo',
            system: 'referrals',
            url: '/referralInfo',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'getReferralsList',
            system: 'referrals',
            url: '/referralsList',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'takeProfit',
            system: 'referrals',
            url: '/takeRefProfit',
            type: 'POST',
        });
    }
}

import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    IPushMessageParams,
    InjectionService,
    LogService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    IRefInfo,
    IRefItem,
    IRefList,
    IRefListQueryParams,
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
        protected injectionService: InjectionService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        this.init();
    }

    public async getRefInfo(): Promise<RefInfoModel | null> {
        try {
            return await this.dataService.request<IData<IRefInfo>>('referrals/getReferralInfo')
                .then((result: IData<IRefInfo>): RefInfoModel => {
                    const refInfo: RefInfoModel = new RefInfoModel(result.data);
                    this.refInfo$.next(refInfo);
                    return refInfo;
                });
        } catch (error) {
            this.logService.sendLog({
                code: '30.0.0',
                data: error,
            });
            return null;
        }
    }

    public async fetchRefList(params: IRefListQueryParams): Promise<IRefItem[]> {
        try {
            const res: IData<IRefList> =
             await this.dataService.request<IData<IRefList>>('referrals/getReferralsList', params);
            return res.data.referrals;
        } catch (error) {
            this.showReferralError(error.errors);
            this.logService.sendLog({
                code: '30.1.0',
                data: error,
            });
            return Promise.reject(error);
        }
    }

    public async takeProfit(): Promise<any> {
        try {
            const res: IData = await this.dataService.request<IData>('referrals/takeProfit');

            if (res.data.result) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                    },
                });
                this.getRefInfo();
            }

        } catch (error) {
            this.showReferralError(error.errors);
            this.logService.sendLog({
                code: '30.2.0',
                data: error,
            });
            return Promise.reject(error);
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
            events: {
                success: 'REF_INFO_SUCCESS',
                fail: 'REF_INFO_ERROR',
            },
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

    private async init(): Promise<void> {
        await this.configService.ready;
        this.registerMethods();
    }
}

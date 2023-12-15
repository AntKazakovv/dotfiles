import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    map,
    distinctUntilChanged,
} from 'rxjs/operators';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    InjectionService,
    LogService,
} from 'wlc-engine/modules/core';
import {RequestParamsType} from 'wlc-engine/modules/core/system/services/data/data.service';
import {ILottery} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user';

interface ILotteriesResponse {
    lotteries: ILottery[];
}

@Injectable({
    providedIn: 'root',
})
export class LotteriesService {
    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });
    /** Active lottery */
    public lottery$: BehaviorSubject<Lottery> = new BehaviorSubject(null);
    public userCurrency: string;

    private $resolve: () => void;
    private lottery: Lottery;
    private isAuth: boolean;
    private userLevel: string;
    private userInfo$: BehaviorSubject<UserInfo>;
    private isFetching$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected injectionService: InjectionService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        this.init();
    }

    public async fetchLottery(): Promise<Lottery> {
        await this.ready;

        if (this.isFetching$.getValue()) {
            return;
        }

        const requestParams: RequestParamsType = this.userCurrency ? {wallet: this.userCurrency} : null;
        try {
            this.isFetching$.next(true);
            const response: IData<ILotteriesResponse> = await this.dataService.request({
                name: 'lotteries',
                system: 'lotteries',
                url: '/lotteries',
                type: 'GET',
            }, requestParams);

            if (response.data.lotteries && response.data.lotteries.length) {
                this.lottery = new Lottery(response.data.lotteries[0]);
                this.lottery$.next(this.lottery);
                return this.lottery;
            }
        } catch (error) {
            this.logService.sendLog({
                code: '28.0.0',
                data: error,
            });
        } finally {
            this.isFetching$.next(false);
        }
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((profile: UserProfile): boolean => !!profile),
                map((profile: UserProfile): string => profile.selectedCurrency),
                distinctUntilChanged(),
            )
            .subscribe((currency: string) => {
                this.userCurrency = currency.toLowerCase();
                Lottery.userCurrency =  this.userCurrency;
                this.fetchLottery();
                this.$resolve();
            });

        if (!this.isAuth) {
            this.$resolve();
        }
    }
};

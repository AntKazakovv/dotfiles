import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    filter,
    map,
    distinctUntilChanged,
    takeUntil,
} from 'rxjs/operators';
import _merge from 'lodash-es/merge';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user';
import {ILotteryFetchParams} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';

export interface ILotteryController {
    pending$: BehaviorSubject<boolean>;
    isAuth: boolean;
    update$: Subject<void>;
    fetchParams: ILotteryFetchParams;
    userLevel: number;
    lottery$: BehaviorSubject<Lottery>;
    fetchLottery(params?: ILotteryFetchParams): Promise<Lottery>
    destroy(): void;
}

export class LotteryController implements ILotteryController {
    public isAuth: boolean;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public update$: Subject<void> = new Subject();
    public fetchParams: ILotteryFetchParams = {};
    public userLevel: number;
    public lottery$: BehaviorSubject<Lottery> = new BehaviorSubject(null);

    protected $destroy: Subject<void> = new Subject();

    constructor(
        protected lotteriesService: LotteriesService,
        protected configService: ConfigService,
        protected eventService: EventService,
        params?: ILotteryFetchParams,
    ) {
        this.fetchParams = _merge(this.fetchParams, params);
        this.init();
    }

    private init(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');

            this.fetchLottery();
        }, this.$destroy);

        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((profile: UserProfile): boolean => !!profile),
                map((profile: UserProfile): string => profile.selectedCurrency),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((currency: string) => {
                _merge(this.fetchParams, {
                    wallet: currency.toLowerCase(),
                });

                this.fetchLottery();
            });

        this.configService.get<BehaviorSubject<UserInfo>>('$user.userInfo$')
            .pipe(
                map((data: UserInfo): number => Number(data?.loyalty?.Level)),
                filter((level: number): boolean => level !== this.userLevel),
                takeUntil(this.$destroy),
            ).subscribe((level: number): void => {
                Lottery.userLevel = this.userLevel = level;
                this.update$.next();
            });

    }

    public async fetchLottery(): Promise<Lottery> {
        const lottery: Lottery = await this.lotteriesService.fetchLottery(this.fetchParams);
        this.lottery$.next(lottery);
        this.pending$.next(false);
        return lottery;
    }

    public destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }
}

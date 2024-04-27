import {
    ChangeDetectorRef,
    Directive,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {ILotteryFetchParams} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {UserInfo} from 'wlc-engine/modules/user';

@Directive()
export abstract class LotteryAbstract<T> extends AbstractComponent {
    public lottery: Lottery;
    public isAuth: boolean;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public update$: Subject<void> = new Subject();

    protected userLevel: number;

    constructor(
        params: IMixedParams<T>,
        protected lotteriesService: LotteriesService,
        protected eventService: EventService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(params, configService, cdr);

        this.init();
    }

    public init(): void {
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.markForCheck();
        }, this.$destroy);

        this.watchForUserLevel();
    }

    public async getLottery(params?: ILotteryFetchParams): Promise<void> {
        this.pending$.next(true);
        this.lottery = await this.lotteriesService.fetchLottery(params);
        this.pending$.next(false);
    }

    protected watchForUserLevel(): void {
        this.configService.get<BehaviorSubject<UserInfo>>('$user.userInfo$')
            .pipe(
                map((data: UserInfo): number => Number(data?.loyalty?.Level)),
                filter((level: number): boolean => level !== this.userLevel),
                takeUntil(this.$destroy),
            ).subscribe((level: number): void => {
                Lottery.userLevel = this.userLevel = level;
                this.update$.next();
                this.cdr.markForCheck();
            });
    }
}

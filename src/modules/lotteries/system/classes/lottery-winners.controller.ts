import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import {LotteryResult} from 'wlc-engine/modules/lotteries/system/models/lottery-result.model';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {ConfigService} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {ILotteryWinnersCParams} from 'wlc-engine/modules/lotteries/components/lottery-winners/lottery-winners.params';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

export class LotteryWinnersController {
    public results: LotteryResult[] = [];
    public results$: BehaviorSubject<LotteryResult[]> = new BehaviorSubject([]);
    public isExpanded: boolean = false;

    protected allResults: LotteryResult[] = [];
    protected trimmedResults: LotteryResult[] = [];
    protected $destroy: Subject<void> = new Subject();

    constructor(
        protected lottery: BaseLottery,
        protected params: ILotteryWinnersCParams,
        protected lotteriesService: LotteriesService,
        protected configService: ConfigService,
    ) {
        this.init();
    }

    public get showAllBtn(): boolean {
        return this.allResults.length > this.params.placesLimit;
    }

    public toggleWinners(): void {
        this.isExpanded = !this.isExpanded;
        this.updateWinnersList();
    }

    public destroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected init(): void {
        const profile: BehaviorSubject<UserProfile>
            = this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'});

        profile.pipe(
            filter((v) => !!v),
            map((data: UserProfile): number => {
                return Number(data.idUser) || null;
            }),
            distinctUntilChanged(),
            takeUntil(this.$destroy),
        ).subscribe((id: number) => {
            this.lottery.updateResults(id);
            this.setResults();
        });

        this.setResults();
    }

    protected setResults(): void {
        this.allResults = this.lottery.results;
        this.trimmedResults = this.allResults.slice(0, this.params.placesLimit);

        this.updateWinnersList();
    }

    protected updateWinnersList(): void {
        if (this.isExpanded) {
            this.results$.next(this.allResults);
        } else {
            this.results$.next(this.trimmedResults);
        }
    }
}

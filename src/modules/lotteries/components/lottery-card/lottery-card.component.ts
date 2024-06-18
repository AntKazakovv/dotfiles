import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnDestroy,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
    takeUntil,
} from 'rxjs';

import {
    AbstractComponent,
    EventService,
} from 'wlc-engine/modules/core';
import {ILotteryPrizePoolCParams}
    from 'wlc-engine/modules/lotteries/components/lottery-prizepool/lottery-prizepool.params';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {LotteryController} from 'wlc-engine/modules/lotteries/system/classes/lottery.controller';

import * as Params from './lottery-card.params';

@Component({
    selector: '[wlc-lottery-card]',
    templateUrl: './lottery-card.component.html',
    styleUrls: ['./styles/lottery-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryCardComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILotteryCardCParams;

    public update$: Subject<void> = new Subject();
    public override $params: Params.ILotteryCardCParams;
    public prizesParams: ILotteryPrizePoolCParams;
    public lottery: Lottery;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject(true);

    protected lotteryController: LotteryController;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryCardCParams,
        protected eventService: EventService,
        protected lotteriesService: LotteriesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.lotteryController = new LotteryController(
            this.lotteriesService,
            this.configService,
            this.eventService,
        );
        this.pending$.next(true);

        await this.lotteryController.fetchLottery();
        this.lotteryController.lottery$.pipe(
            takeUntil(this.$destroy),
        ).subscribe((lottery: Lottery) => {
            this.lottery = lottery;
            this.cdr.markForCheck();
        });

        this.pending$.next(false);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.lotteryController.destroy();
    }

    public get showTicketsCounter(): boolean {
        return this.lotteryController.isAuth;
    }

    public updateView(): void {
        this.update$.next();
        this.cdr.markForCheck();
    }
}

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    BehaviorSubject,
    Subject,
    takeUntil,
} from 'rxjs';
import _merge from 'lodash-es/merge';
import _assign from 'lodash-es/assign';

import {
    AbstractComponent,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';

import {ILotteryPrizesCParams} from 'wlc-engine/modules/lotteries/components/lottery-prizes/lottery-prizes.params';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';

import * as Params from './lottery-card.params';

@Component({
    selector: '[wlc-lottery-card]',
    templateUrl: './lottery-card.component.html',
    styleUrls: ['./styles/lottery-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryCardComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILotteryCardCParams;

    public lottery: Lottery;
    public override $params: Params.ILotteryCardCParams;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public prizesParams: ILotteryPrizesCParams;
    public update$: Subject<void> = new Subject();
    public isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryCardCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected lotteriesService: LotteriesService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        await this.getLottery();

        this.lotteriesService.lottery$.pipe(
            takeUntil(this.$destroy),
        ).subscribe((lottery: Lottery): void => {
            this.lottery = lottery;
            this.setPrizesParams();
            this.cdr.markForCheck();
        });

        this.setPrizesParams();

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
        ], () => {
            this.isAuth = this.configService.get('$user.isAuthenticated');
            this.cdr.markForCheck();
        }, this.$destroy);
    }

    public get showTicketsCounter(): boolean {
        return this.isAuth;
    }

    public updateView(): void {
        this.update$.next();
        this.cdr.markForCheck();
    }

    private setPrizesParams(): void {
        this.prizesParams = _assign(_merge(this.$params.prizesParams, {
            lottery: this.lottery,
        }));
        this.cdr.markForCheck();
    }

    private async getLottery(): Promise<void> {
        this.pending$.next(true);
        this.lottery = await this.lotteriesService.fetchLottery();
        this.pending$.next(false);
    }
}

import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {ILotteryPrize} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';

import * as Params from './lottery-prizes.params';

@Component({
    selector: '[wlc-lottery-prizes]',
    templateUrl: './lottery-prizes.component.html',
    styleUrls: ['./styles/lottery-prizes.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryPrizesComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.ILotteryPrizesCParams;
    @Input() protected lottery: Lottery;

    public override $params: Params.ILotteryPrizesCParams;
    public prizeTable: ILotteryPrize[] = [];

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryPrizesCParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.setPrizeTable();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes.lottery) {
            this.setPrizeTable();
            this.cdr.markForCheck();
        }
    }

    private setPrizeTable(): void {
        this.prizeTable = this.lottery?.prizes.getPrizes(this.$params?.limit);
    }
}

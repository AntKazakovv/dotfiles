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
    public showMoreBtn: boolean = true;
    protected isExpanded: boolean = false;

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

    public toggleTable(): void {
        if (this.isExpanded) {
            this.setPrizeTable();
        } else {
            this.prizeTable = this.lottery.prizes.prizeTable;
        }
        this.isExpanded = !this.isExpanded;
    }

    public get showAllText(): string {
        return this.isExpanded ? 'Show less' : 'Show all';
    }

    private setPrizeTable(): void {
        this.showMoreBtn = this.$params?.showMoreBtn && this.lottery?.prizes.totalRows > this.$params.limit;
        this.prizeTable = this.lottery?.prizes.getPrizes(this.$params?.limit);
    }
}

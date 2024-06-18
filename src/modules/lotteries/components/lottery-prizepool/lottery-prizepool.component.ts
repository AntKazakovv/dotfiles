import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {ILotteryPrizeRow} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';

import * as Params from './lottery-prizepool.params';

@Component({
    selector: '[wlc-lottery-prizepool]',
    templateUrl: './lottery-prizepool.component.html',
    styleUrls: ['./styles/lottery-prizepool.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryPrizePoolComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.ILotteryPrizePoolCParams;
    @Input() protected lottery: Lottery;

    public override $params: Params.ILotteryPrizePoolCParams;
    public prizeTable: ILotteryPrizeRow[] = [];
    public showMoreBtn: boolean = true;
    protected isExpanded: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryPrizePoolCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.setPrizeTable();
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes.lottery) {
            this.setPrizeTable();
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

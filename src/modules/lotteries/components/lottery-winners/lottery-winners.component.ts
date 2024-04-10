import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
    OnDestroy,
} from '@angular/core';

import {takeUntil} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {LotteryWinnersController} from 'wlc-engine/modules/lotteries/system/classes/lottery-winners.controller';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {LotteryResult} from 'wlc-engine/modules/lotteries/system/models/lottery-result.model';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

import * as Params from './lottery-winners.params';

@Component({
    selector: '[wlc-lottery-winners]',
    templateUrl: './lottery-winners.component.html',
    styleUrls: ['./styles/lottery-winners.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryWinnersComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILotteryWinnersCParams;
    @Input() protected lottery: BaseLottery;
    @Input() protected showHeader: boolean = false;

    public override $params: Params.ILotteryWinnersCParams;
    public list: LotteryResult[] = [];
    public loadMoreBtnParams: IButtonCParams;

    protected controller: LotteryWinnersController;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryWinnersCParams,
        protected lotteriesService: LotteriesService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.controller = new LotteryWinnersController(
            this.lottery,
            this.$params,
            this.lotteriesService,
            this.configService,
        );

        this.controller.results$
            .pipe(takeUntil(this.$destroy))
            .subscribe((res: LotteryResult[]) => {
                this.list = res;
                this.cdr.markForCheck();
            });
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.controller.destroy();
    }

    public get showAllBtn(): boolean {
        return this.controller?.showAllBtn;
    }

    public get toggleBtnText(): string {
        return this.controller.isExpanded ? gettext('Show less') : gettext('Show all');
    }

    public toggleResults(): void {
        this.controller.toggleWinners();
    }
}

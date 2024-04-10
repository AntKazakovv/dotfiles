import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './lottery-prize.params';
import {ILotteryPrize} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';

@Component({
    selector: '[wlc-lottery-prize]',
    templateUrl: './lottery-prize.component.html',
    styleUrls: ['./styles/lottery-prize.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryPrizeComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILotteryPrizeCParams;
    @Input() public prize: ILotteryPrize;

    public override $params: Params.ILotteryPrizeCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryPrizeCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}

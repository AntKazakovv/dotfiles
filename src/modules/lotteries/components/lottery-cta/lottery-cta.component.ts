import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';

import * as Params from './lottery-cta.params';

@Component({
    selector: '[wlc-lottery-cta]',
    templateUrl: './lottery-cta.component.html',
    styleUrls: ['./styles/lottery-cta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryCtaComponent extends AbstractComponent implements OnInit {
    @Input() public lottery: Lottery;
    @Input() protected inlineParams: Params.ILotteryCtaCParams;

    public override $params: Params.ILotteryCtaCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryCtaCParams,
        protected override configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
